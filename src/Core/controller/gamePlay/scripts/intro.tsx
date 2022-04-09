import { ISentence } from '../../../interface/coreInterface/sceneInterface'
import { IPerform } from '../../../interface/coreInterface/performInterface'
import React from 'react'
import ReactDOM from 'react-dom'
import styles from '../../../../Components/Stage/FullScreenPerform/fullScreenPerform.module.scss'
import { eventSender } from '../../eventBus/eventSender'

export const intro = (sentence: ISentence): IPerform => {
    const introArray: Array<string> = sentence.content.split(/\|/)
    const showIntro = introArray.map((e, i) => (
        <div style={{ animationDelay: `${1500 * i}ms` }} className={styles.introElement} key={i}>
            {e}
        </div>
    ))
    const intro = <div>{showIntro}</div>
    ReactDOM.render(intro, document.getElementById('introContainer'))
    const introContainer = document.getElementById('introContainer')
    if (introContainer) {
        introContainer.style.display = 'block'
    }
    return {
        performName: 'introPerform',
        duration: 1000 + 1500 * introArray.length,
        isOver: false,
        isHoldOn: false,
        stopFunction: () => {
            const introContainer = document.getElementById('introContainer')
            if (introContainer) {
                introContainer.style.display = 'none'
            }
            eventSender('nextSentence_target', 0, 1)
        },
        blockingNext: () => false,
        blockingAuto: () => true,
        stopTimeout: undefined, // 暂时不用，后面会交给自动清除
    }
}
