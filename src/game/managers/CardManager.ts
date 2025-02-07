import { Container } from "pixi.js";
import { Card } from "../objects/Card";
import { shuffleArray } from "../../utils/arrayUtils";
import { cardSymbols } from "@config";
import { CardSymbol } from "../types/card";
import { wait } from "../../utils/misc";
import { IGameState } from "../interfaces/IGameState";

export class CardManager {
  protected container: Container;
  protected cardRefs: Card[] = [];
  protected symbols: CardSymbol[] = [];
  protected selectedCard: Card | null = null;

  constructor(
    private state: IGameState,
    protected rowCount: number,
    protected colCount: number,
  ) {
    this.container = new Container();

    this.prepareSymbols();
    this.createCards();
  }

  get view() {
    return this.container;
  }

  async processCardClick(card: Card): Promise<void> {
    if (this.state.isClickAllowed()) {
      this.state.setBusy();

      if (this.selectedCard) {
        // same item clicked - hide it
        if (this.selectedCard === card) {
          await this.selectedCard.hide();
        }
        // match found!
        else if (this.selectedCard.symbol === card.symbol) {
          card.show();
          card.lock();
          this.selectedCard.lock();
        }
        // no match - hide both
        else {
          card.show();
          await wait(0.5);
          card.hide();
          await this.selectedCard.hide();
        }

        this.selectedCard = null;
      } else {
        card.show();
        this.selectedCard = card;
      }


      this.state.setIdle();
    }
  }

  async flipAllCards(show: boolean = true): Promise<void> {
    for (const card of this.cardRefs) {
      if (show) {
        card.show();
      }
      else {
        if (card.symbol !== "empty") {
          card.hide();
        }
      }
      await wait(0.03);
    }
  }

  protected prepareSymbols(): void {
    const totalCards = this.colCount * this.rowCount;
    const pairs = Math.floor(totalCards / 2);

    // Copy symbols without "empty" one
    const uniqueSymbols = cardSymbols.slice(0, -1);

    const symbols = Array.from(
      { length: pairs },
      () =>
        uniqueSymbols.splice(
          Math.floor(Math.random() * uniqueSymbols.length),
          1,
        )[0],
    );

    this.symbols = [...shuffleArray(symbols), ...shuffleArray(symbols)];

    // add empty block if needed
    if (totalCards / 2 !== pairs) {
      this.symbols.push("empty");
    }

    this.symbols = shuffleArray(this.symbols);
  }

  protected createCards() {
    for (let x = 0; x < this.colCount; x++) {
      for (let y = 0; y < this.rowCount; y++) {
        const symbol = this.symbols[this.colCount * y + x];
        const card = new Card(this, symbol);
        card.view.x = x * 78 + card.view.width / 2;
        card.view.y = y * 78 + card.view.height / 2;
        this.container.addChild(card.view);
        this.cardRefs.push(card);

        if (symbol === 'empty') {
          card.lock()
        }
      }
    }
  }
}