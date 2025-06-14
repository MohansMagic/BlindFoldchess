import { Component } from '@angular/core';
import { NgClass, NgIf, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chess, Move } from 'chess.js';

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

  get board(): Piece[][] {
    // Convert chess.js board to your Piece[][] format
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

  movePiece(move: string) {
    this.moveError = '';
    move = move.trim();
    if (!move) return;
    const result = this.chess.move(move); // No sloppy option
    if (!result) {
      this.moveError = 'Invalid move! Use notation like e4, Nf3, exd5, etc.';
    }
    this.moveInput = '';
  }

  get fen(): string {
    return this.chess.fen();
  }

  get pgn(): string {
    return this.chess.pgn();
  }

  get moveHistory(): string[] {
    // Returns an array of SAN moves for display
    return this.chess.history({ verbose: true }).map((m: Move) => m.san);
  }

  reset() {
    this.chess.reset();
    this.moveError = '';
    this.moveInput = '';
  }
}
