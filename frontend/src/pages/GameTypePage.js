import React from 'react';
import { GAME_TYPES } from '../data/gameData';
import { GameIcon } from '../components/Icons';

export default function GameTypePage({ game, onSelect }) {
  return (
    <div className="game-type-page">
      <div className="game-type-grid">
        {GAME_TYPES.map((gt, i) => (
          <div
            key={gt.id}
            className="gt-cell anim-in"
            style={{ animationDelay: `${i * 0.03}s` }}
            onClick={() => onSelect(gt)}
          >
            <div className="gt-icon-wrap">
              <GameIcon name={gt.icon} />
            </div>
            <div className="gt-label">{gt.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
