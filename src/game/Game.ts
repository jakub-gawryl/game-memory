import { Container } from "pixi.js";
import { gameConfig } from "../config";
import { CardManager } from "./managers/CardManager";
import { GameState } from "./types/game";
import { wait } from "../utils/misc";
import { IGameState } from "./interfaces/IGameState";

export class Game implements IGameState {
  private container: Container;

  protected gameState: GameState = "busy";
  protected cardManager: CardManager = null;

  constructor() {
    this.container = new Container();

    this.cardManager = new CardManager(this, gameConfig.cols, gameConfig.rows);
    this.container.addChild(this.cardManager.view);
  }

  get view() { return this.container; }

  async start(): Promise<void> {
    this.setBusy();
    await this.cardManager.flipAllCards(true);
    await wait(2);
    await this.cardManager.flipAllCards(false);
    this.setIdle();
  }

  setBusy(): void {
    this.gameState = "busy";
  }

  setIdle(): void {
    this.gameState = "idle";
  }

  onResize(width: number, height: number) {
    this.container.x = width / 2 - this.container.width / 2;
    this.container.y = height / 2 - this.container.height / 2;
  }

  isClickAllowed(): boolean {
    return this.gameState === "idle";
  }
}