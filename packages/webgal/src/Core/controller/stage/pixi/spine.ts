import { WebGALPixiContainer } from '@/Core/controller/stage/pixi/WebGALPixiContainer';
import { v4 as uuid } from 'uuid';
import 'pixi-spine'; // Do this once at the very start of your code. This registers the loader!
import { Spine } from 'pixi-spine';
import * as PIXI from 'pixi.js';
import PixiStage from '@/Core/controller/stage/pixi/PixiController';
import { logger } from '@/Core/util/logger';

// eslint-disable-next-line max-params
export function addSpineFigureImpl(
  this: PixiStage,
  key: string,
  url: string,
  presetPosition: 'left' | 'center' | 'right' = 'center',
) {
  console.log(key, url, presetPosition);
  const spineId = `spine-${url}`;
  const loader = this.assetLoader;
  // 准备用于存放这个立绘的 Container
  const thisFigureContainer = new WebGALPixiContainer();

  // 是否有相同 key 的立绘
  const setFigIndex = this.figureObjects.findIndex((e) => e.key === key);
  const isFigSet = setFigIndex >= 0;

  // 已经有一个这个 key 的立绘存在了
  if (isFigSet) {
    this.removeStageObjectByKey(key);
  }

  const metadata = this.getFigureMetadataByKey(key);
  if (metadata) {
    if (metadata.zIndex) {
      thisFigureContainer.zIndex = metadata.zIndex;
    }
  }
  // 挂载
  this.figureContainer.addChild(thisFigureContainer);
  const figureUuid = uuid();
  this.figureObjects.push({
    uuid: figureUuid,
    key: key,
    pixiContainer: thisFigureContainer,
    sourceUrl: url,
    sourceType: 'live2d',
    sourceExt: this.getExtName(url),
  });

  // 完成图片加载后执行的函数
  const setup = () => {
    const spineResource: any = this.assetLoader.resources?.[spineId];
    // TODO：找一个更好的解法，现在的解法是无论是否复用原来的资源，都设置一个延时以让动画工作正常！
    setTimeout(() => {
      if (spineResource && this.getStageObjByUuid(figureUuid)) {
        const figureSpine = new Spine(spineResource.spineData);
        const spineBounds = figureSpine.getLocalBounds();
        const spineCenterX = spineBounds.x + spineBounds.width / 2;
        const spineCenterY = spineBounds.y + spineBounds.height / 2;
        figureSpine.pivot.set(spineCenterX, spineCenterY);
        // TODO: set animation 还没做
        // figureSpine.state.setAnimation()
        /**
         * 重设大小
         */
        const originalWidth = figureSpine.width;
        const originalHeight = figureSpine.height;
        const scaleX = this.stageWidth / originalWidth;
        const scaleY = this.stageHeight / originalHeight;
        const targetScale = Math.min(scaleX, scaleY);
        const figureSprite = new PIXI.Sprite();
        figureSprite.addChild(figureSpine);
        figureSprite.scale.x = targetScale;
        figureSprite.scale.y = targetScale;
        figureSprite.anchor.set(0.5);
        figureSprite.position.y = this.stageHeight / 2;
        const targetWidth = originalWidth * targetScale;
        const targetHeight = originalHeight * targetScale;
        thisFigureContainer.setBaseY(this.stageHeight / 2);
        if (targetHeight < this.stageHeight) {
          thisFigureContainer.setBaseY(this.stageHeight / 2 + this.stageHeight - targetHeight / 2);
        }
        if (presetPosition === 'center') {
          thisFigureContainer.setBaseX(this.stageWidth / 2);
        }
        if (presetPosition === 'left') {
          thisFigureContainer.setBaseX(targetWidth / 2);
        }
        if (presetPosition === 'right') {
          thisFigureContainer.setBaseX(this.stageWidth - targetWidth / 2);
        }
        thisFigureContainer.pivot.set(0, this.stageHeight / 2);
        thisFigureContainer.addChild(figureSprite);
      }
    }, 0);
  };

  /**
   * 加载器部分
   */
  this.cacheGC();
  if (!loader.resources?.[url]) {
    this.loadAsset(url, setup, spineId);
  } else {
    // 复用
    setup();
  }
}

export function addSpineBgImpl(this: PixiStage, key: string, url: string) {
  const spineId = `spine-${url}`;
  const loader = this.assetLoader;
  // 准备用于存放这个背景的 Container
  const thisBgContainer = new WebGALPixiContainer();

  // 是否有相同 key 的背景
  const setBgIndex = this.backgroundObjects.findIndex((e) => e.key === key);
  const isBgSet = setBgIndex >= 0;

  // 已经有一个这个 key 的背景存在了
  if (isBgSet) {
    // 挤占
    this.removeStageObjectByKey(key);
  }

  // 挂载
  this.backgroundContainer.addChild(thisBgContainer);
  const bgUuid = uuid();
  this.backgroundObjects.push({
    uuid: bgUuid,
    key: key,
    pixiContainer: thisBgContainer,
    sourceUrl: url,
    sourceType: 'live2d',
    sourceExt: this.getExtName(url),
  });

  // 完成图片加载后执行的函数
  const setup = () => {
    const spineResource: any = this.assetLoader.resources?.[spineId];
    // TODO：找一个更好的解法，现在的解法是无论是否复用原来的资源，都设置一个延时以让动画工作正常！
    setTimeout(() => {
      if (spineResource && this.getStageObjByUuid(bgUuid)) {
        const bgSpine = new Spine(spineResource.spineData);
        const transY = spineResource?.spineData?.y ?? 0;
        /**
         * 重设大小
         */
        const originalWidth = bgSpine.width; // TODO: 视图大小可能小于画布大小，应提供参数指定视图大小
        const originalHeight = bgSpine.height; // TODO: 视图大小可能小于画布大小，应提供参数指定视图大小
        const scaleX = this.stageWidth / originalWidth;
        const scaleY = this.stageHeight / originalHeight;
        logger.debug('bgSpine state', bgSpine.state);
        // TODO: 也许应该使用 setAnimation 播放初始动画
        if (bgSpine.spineData.animations.length > 0) {
          // 播放首个动画
          bgSpine.state.setAnimation(0, bgSpine.spineData.animations[0].name, true);
        }
        const targetScale = Math.max(scaleX, scaleY);
        const bgSprite = new PIXI.Sprite();
        bgSprite.addChild(bgSpine);
        bgSprite.scale.x = targetScale;
        bgSprite.scale.y = targetScale;
        bgSprite.anchor.set(0.5);
        bgSprite.position.y = this.stageHeight / 2;
        thisBgContainer.setBaseX(this.stageWidth / 2);
        thisBgContainer.setBaseY(this.stageHeight / 2);
        thisBgContainer.pivot.set(0, this.stageHeight / 2);

        // 挂载
        thisBgContainer.addChild(bgSprite);
      }
    }, 0);
  };

  /**
   * 加载器部分
   */
  this.cacheGC();
  if (!loader.resources?.[url]) {
    this.loadAsset(url, setup, spineId);
  } else {
    // 复用
    setup();
  }
}
