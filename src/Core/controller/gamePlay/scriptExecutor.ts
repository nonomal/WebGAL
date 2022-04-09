import { commandType, ISentence } from '../../interface/coreInterface/sceneInterface'
import { runtime_currentBacklog } from '../../runtime/backlog'
import { getRef } from '../../store/storeRef'
import { runtime_currentSceneData } from '../../runtime/sceneData'
import { runScript } from './runScript'
import { logger } from '../../util/logger'
import { IStageState } from '../../interface/stateInterface/stageInterface'
import * as _ from 'lodash'
import { restoreScene } from '../scene/restoreScene'
import { IBacklogItem, sceneEntry } from '../../interface/coreInterface/runtimeInterface'

/**
 * 语句执行器
 * 执行语句，同步场景状态，并根据情况立即执行下一句或者加入backlog
 */
export const scriptExecutor = () => {
    // 超过总语句数量，则从场景栈拿出一个需要继续的场景，然后继续流程。若场景栈清空，则停止流程
    if (runtime_currentSceneData.currentSentenceId > runtime_currentSceneData.currentScene.sentenceList.length - 1) {
        if (runtime_currentSceneData.sceneStack.length !== 0) {
            const sceneToRestore: sceneEntry | undefined = runtime_currentSceneData.sceneStack.pop()
            if (sceneToRestore !== undefined) {
                restoreScene(sceneToRestore)
            }
        }
        return
    }
    const currentScript: ISentence =
        runtime_currentSceneData.currentScene.sentenceList[runtime_currentSceneData.currentSentenceId]
    // 执行语句
    runScript(currentScript)
    let isNext = false // 是否要进行下一句
    currentScript.args.forEach((e) => {
        // 判断是否有下一句的参数
        if (e.key === 'next' && e.value) {
            isNext = true
        }
    })
    const isSaveBacklog = currentScript.command === commandType.say // 是否在本句保存backlog（一般遇到对话保存）
    let currentStageState: IStageState
    // 同步当前舞台数据
    const currentStageStoreRef = getRef('stageRef')
    currentStageState = currentStageStoreRef.getStageState()
    // 执行“下一句”
    if (isNext) {
        runtime_currentSceneData.currentSentenceId++
        scriptExecutor()
        return
    }
    logger.info('当前执行结果', currentStageState)
    // 保存 backlog
    if (isSaveBacklog) {
        const backlogElement: IBacklogItem = {
            currentStageState: _.cloneDeep(currentStageState),
            saveScene: {
                currentSentenceId: runtime_currentSceneData.currentSentenceId, // 当前语句ID
                sceneStack: _.cloneDeep(runtime_currentSceneData.sceneStack), // 场景栈
                sceneName: runtime_currentSceneData.currentScene.sceneName, // 场景名称
                sceneUrl: runtime_currentSceneData.currentScene.sceneUrl, // 场景url
            },
        }
        runtime_currentBacklog.push(backlogElement)
    }
    runtime_currentSceneData.currentSentenceId++
}
