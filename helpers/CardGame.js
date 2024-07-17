import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

const CardGame = () => {
  const [playerStats, setPlayerStats] = useState({ HP: 20, AP: 0, DP: 0 });
  const [npcStats, setNpcStats] = useState({ HP: 20, AP: 0, DP: 0 });
  const [playerRoll, setPlayerRoll] = useState(null);
  const [npcRoll, setNpcRoll] = useState(null);
  const [winner, setWinner] = useState(null);
  const [roundWinner, setRoundWinner] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const generateRandomStat = () => Math.floor(Math.random() * 10) + 1;

  const initializeGame = () => {
    setPlayerStats({ HP: 20, AP: generateRandomStat(), DP: generateRandomStat() });
    setNpcStats({ HP: 20, AP: generateRandomStat(), DP: generateRandomStat() });
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const rollDice = () => {
    return Math.floor(Math.random() * 6) + 1;
  };

  const calculateDamage = (attacker, defender, roll) => {
    const damage = Math.max(0, attacker.AP + roll - defender.DP);
    return damage;
  };

  const handleRoll = () => {
    const playerResult = rollDice();
    const npcResult = rollDice();
    setPlayerRoll(playerResult);
    setNpcRoll(npcResult);

    let damage = 0;
    if (playerResult > npcResult) {
      damage = calculateDamage(playerStats, npcStats, playerResult);
      setNpcStats(prev => ({ ...prev, HP: Math.max(0, prev.HP - damage) }));
      setRoundWinner('Player');
    } else if (npcResult > playerResult) {
      damage = calculateDamage(npcStats, playerStats, npcResult);
      setPlayerStats(prev => ({ ...prev, HP: Math.max(0, prev.HP - damage) }));
      setRoundWinner('NPC');
    } else {
      setRoundWinner('Draw');
    }

    if (playerStats.HP - (npcResult > playerResult ? damage : 0) <= 0) {
      setWinner('NPC');
      setShowModal(true);
    } else if (npcStats.HP - (playerResult > npcResult ? damage : 0) <= 0) {
      setWinner('Player');
      setShowModal(true);
    }
  };

  const resetGame = () => {
    initializeGame();
    setPlayerRoll(null);
    setNpcRoll(null);
    setWinner(null);
    setRoundWinner(null);
    setShowModal(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Card Battle Game</h1>
      <div className="flex justify-between mb-4">
        <Card className="w-1/2 mr-2">
          <CardHeader>
            <CardTitle>Player Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>HP: {playerStats.HP}</p>
            <p>AP: {playerStats.AP}</p>
            <p>DP: {playerStats.DP}</p>
            <p>Last Roll: {playerRoll}</p>
          </CardContent>
        </Card>
        <Card className="w-1/2 ml-2">
          <CardHeader>
            <CardTitle>NPC Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>HP: {npcStats.HP}</p>
            <p>AP: {npcStats.AP}</p>
            <p>DP: {npcStats.DP}</p>
            <p>Last Roll: {npcRoll}</p>
          </CardContent>
        </Card>
      </div>
      <div className="text-center mb-4">
        {roundWinner && (
          <Badge variant={roundWinner === 'Draw' ? 'secondary' : 'primary'} className="mb-2">
            {roundWinner === 'Draw' ? 'Draw' : `${roundWinner} won the round!`}
          </Badge>
        )}
        <Button onClick={handleRoll} disabled={winner !== null}>Roll Dice</Button>
      </div>
      <AlertDialog open={showModal} onOpenChange={setShowModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Game Over</AlertDialogTitle>
            <AlertDialogDescription>
              {winner === 'Player' ? 'Congratulations! You won!' : 'The NPC has won. Better luck next time!'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={resetGame}>Play Again</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CardGame;
