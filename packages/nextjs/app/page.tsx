"use client";

import { useEffect, useState } from "react";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function Home() {
  const [winnerName, setWinnerName] = useState<string>("");
  const [winnerVotes, setWinnerVotes] = useState<number>(0);

  // Чтение кандидатов (индекс → структура)
  const candidate0 = useScaffoldReadContract({
    contractName: "Voting",
    functionName: "candidates",
    args: [0n],
  });

  const candidate1 = useScaffoldReadContract({
    contractName: "Voting",
    functionName: "candidates",
    args: [1n],
  });

  const candidate2 = useScaffoldReadContract({
    contractName: "Voting",
    functionName: "candidates",
    args: [2n],
  });

  // Чтение победителя
  const winner = useScaffoldReadContract({
    contractName: "Voting",
    functionName: "getWinner",
  });

  // Функция голосования
  const { writeContractAsync: vote } = useScaffoldWriteContract({
    contractName: "Voting",
  });

  // Обновляем победителя
  useEffect(() => {
    if (winner.data && Array.isArray(winner.data)) {
      setWinnerName(winner.data[0]);
      setWinnerVotes(Number(winner.data[1]));
    }
  }, [winner.data]);

  return (
    <div className="p-8 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-6">Decentralized Voting</h1>

      <h2 className="text-xl font-semibold mb-4">Candidates</h2>

      <div className="space-y-4">
        {candidate0.data && (
          <div className="border p-4 rounded-lg">
            <p className="font-bold">{candidate0.data[0]}</p>
            <button className="btn btn-primary mt-2" onClick={() => vote({ functionName: "vote", args: [0n] })}>
              Vote
            </button>
          </div>
        )}

        {candidate1.data && (
          <div className="border p-4 rounded-lg">
            <p className="font-bold">{candidate1.data[0]}</p>
            <button className="btn btn-primary mt-2" onClick={() => vote({ functionName: "vote", args: [1n] })}>
              Vote
            </button>
          </div>
        )}

        {candidate2.data && (
          <div className="border p-4 rounded-lg">
            <p className="font-bold">{candidate2.data[0]}</p>
            <button className="btn btn-primary mt-2" onClick={() => vote({ functionName: "vote", args: [2n] })}>
              Vote
            </button>
          </div>
        )}
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-2">Winner</h2>
      <div className="border rounded-lg p-4 bg-base-200">
        <p className="font-bold">{winnerName}</p>
        <p>Votes: {winnerVotes}</p>
      </div>
    </div>
  );
}
