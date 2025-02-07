import Scene from "../core/Scene";
import { Game } from "../game/Game";

export class Main extends Scene {
  private game: Game;

  async load() {
    this.game = new Game();
    this.addChild(this.game.view);
  }

  async start(): Promise<void> {
    this.game.start();
  }

  onResize(width: number, height: number) {
    this.game.onResize(width, height);
  }
}
