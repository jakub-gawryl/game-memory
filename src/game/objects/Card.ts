import gsap from 'gsap';
import { Container, Sprite, Texture } from 'pixi.js';
import { CardSymbol } from '../types/card';
import { CardManager } from '../managers/CardManager';

export class Card {
  private container: Container;
  private sprite: Sprite;

  cardTween: gsap.core.Timeline;
  protected isLocked = false;
  protected isRevealed: boolean = false;

  constructor(
    private boss: CardManager,
    protected cardSymbol: CardSymbol,
  ) {
    this.container = new Container();

    this.sprite = Sprite.from(this.cardSymbol);
    this.sprite.scale.set(0.5);
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.interactive = true;
    this.sprite.cursor = "pointer";
    this.sprite.on("mousedown", this.onMouseDown.bind(this));

    this.container.addChild(this.sprite);
    this.setTexture("hidden");
  }

  get view() {
    return this.container;
  }
  get symbol() {
    return this.cardSymbol;
  }

  async onMouseDown() {
    if (!this.isLocked) {
      this.boss.processCardClick(this);
    }
  }

  async show(): Promise<void> {
    this.isRevealed = true;
    await this.animate();
  }
  async hide(): Promise<void> {
    if (!this.isLocked) {
      this.isRevealed = false;
      await this.animate();
    }
  }

  lock() {
    this.isLocked = true;
  }

  protected async animate(): Promise<
    gsap.core.Omit<gsap.core.Timeline, "then">
  > {
    return (this.cardTween = gsap
      .timeline()
      .to(this.container.scale, {
        x: 0,
        y: 1.1,
        duration: 0.15,
      })
      .add(() => {
        this.setTexture(this.isRevealed ? this.cardSymbol : "hidden");
      })
      .to(this.container.scale, {
        x: 1,
        y: 1,
        duration: 0.2,
      }));
  }

  protected setTexture(texture: CardSymbol | "hidden") {
    this.sprite.texture = Texture.from(texture);
  }
}