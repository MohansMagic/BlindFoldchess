import { Component } from '@angular/core';
import { NgClass, NgIf, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chess, Move, Square } from 'chess.js';

type Piece = '' | 'wK' | 'wQ' | 'wR' | 'wB' | 'wN' | 'wP' | 'bK' | 'bQ' | 'bR' | 'bB' | 'bN' | 'bP';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgClass, NgIf, NgForOf, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  chess = new Chess();
  moveInput = '';
  blindfold = false;
  moveError = '';
  selectedSquare: string | null = null;

  get board(): Piece[][] {
    const raw = this.chess.board();
    return raw.map(row =>
      row.map(cell => {
        if (!cell) return '';
        const color = cell.color === 'w' ? 'w' : 'b';
        const piece = cell.type.toUpperCase();
        return (color + piece) as Piece;
      })
    );
  }

  getPieceUrl(piece: Piece): string {
    const urls: Record<Piece, string> = {
      wK: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
      wQ: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
      wR: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
      wB: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
      wN: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
      wP: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg',
      bK: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg',
      bQ: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg',
      bR: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
      bB: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg',
      bN: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg',
      bP: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg',
      '': ''
    };
    return urls[piece];
  }

  getSquareName(row: number, col: number): string {
    return String.fromCharCode(97 + col) + (8 - row);
  }

  isValidSquare(square: unknown): square is Square {
    return typeof square === 'string' && /^[a-h][1-8]$/.test(square);
  }

  onSquareClick(row: number, col: number) {
    const square = this.getSquareName(row, col);

    if (!this.selectedSquare) {
      if (this.isValidSquare(square)) {
        const piece = this.chess.get(square as Square);
        if (piece && piece.color === this.chess.turn()) {
          this.selectedSquare = square;
          this.moveError = '';
        }
      }
      return;
    }

    if (this.selectedSquare === square) {
      this.selectedSquare = null;
      return;
    }

    if (!this.isValidSquare(this.selectedSquare) || !this.isValidSquare(square)) {
      this.moveError = 'Invalid square!';
      this.selectedSquare = null;
      return;
    }

    let moveResult = this.chess.move({ from: this.selectedSquare as Square, to: square as Square });

    if (!moveResult) {
      const piece = this.chess.get(this.selectedSquare as Square);
      if (
        piece &&
        piece.type === 'p' &&
        (square[1] === '8' || square[1] === '1')
      ) {
        moveResult = this.chess.move({
          from: this.selectedSquare as Square,
          to: square as Square,
          promotion: 'q'
        });
      }
    }

    if (moveResult) {
      this.moveError = '';
    } else {
      this.moveError = 'Invalid move!';
    }
    this.selectedSquare = null;
  }

  movePiece(move: string) {
    this.moveError = '';
    move = move.trim();
    if (!move) return;
    let result = this.chess.move(move);
    if (!result && /^[a-h][1-8][a-h][1-8]$/.test(move)) {
      result = this.chess.move({ from: move.slice(0,2) as Square, to: move.slice(2,4) as Square });
    }
    if (!result) {
      this.moveError = 'Invalid move! Use e4, Nf3, exd5, or e2e4.';
    }
    this.moveInput = '';
    this.selectedSquare = null;
  }

  get fen(): string {
    return this.chess.fen();
  }

  get pgn(): string {
    return this.chess.pgn();
  }

  get moveHistory(): string[] {
    return this.chess.history({ verbose: true }).map((m: Move) => m.san);
  }

  reset() {
    this.chess.reset();
    this.moveError = '';
    this.moveInput = '';
    this.selectedSquare = null;
  }
}
