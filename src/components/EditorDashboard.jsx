import React, { useState, useEffect } from "react";
import { db } from "../assets/firebaseConfig";
import { collection, updateDoc, doc, onSnapshot } from "firebase/firestore";

const EditorDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [message, setMessage] = useState("");
  const [editTeamId, setEditTeamId] = useState("");
  const [scores, setScores] = useState({
    scoreJudge1: 0,
    scoreJudge2: 0,
    scoreJudge3: 0,
    scoreJudge4: 0,
    scoreJudge5: 0,
  });
  const [teamStatus, setTeamStatus] = useState("участвует");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "teams"), (snapshot) => {
      const teamsData = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => a.customId - b.customId);
      setTeams(teamsData);
    });

    return () => unsubscribe();
  }, []);

  const selectTeam = (team) => {
    setEditTeamId(team.id);
    setScores({
      scoreJudge1: team.scoreJudge1 || 0,
      scoreJudge2: team.scoreJudge2 || 0,
      scoreJudge3: team.scoreJudge3 || 0,
      scoreJudge4: team.scoreJudge4 || 0,
      scoreJudge5: team.scoreJudge5 || 0,
    });
    setTeamStatus(team.status || "участвует");
  };

  const calculateFinalScore = (scores) => {
    return Object.values(scores).reduce((sum, score) => sum + score, 0);
  };

  const updateScores = async () => {
    if (!editTeamId) {
      setMessage("Выберите команду для оценки.");
      return;
    }

    const finalScore = calculateFinalScore(scores);
    let newStatus = "завершен";

    if (finalScore === 0) {
      newStatus = "дисквалифицирован";
    }

    try {
      const teamDoc = doc(db, "teams", editTeamId);
      await updateDoc(teamDoc, {
        ...scores,
        finalScore: finalScore,
        status: newStatus,
      });
      setMessage("Оценки и статус команды обновлены!");
      setEditTeamId("");
      setScores({
        scoreJudge1: 0,
        scoreJudge2: 0,
        scoreJudge3: 0,
        scoreJudge4: 0,
        scoreJudge5: 0,
      });
      setTeamStatus("участвует");
    } catch (e) {
      setMessage("Ошибка при обновлении оценок и статуса.");
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        Редактировать оценки команд
      </h2>
      {message && (
        <p
          className={
            message.includes("ошибка") ? "text-red-500" : "text-green-500"
          }
        >
          {message}
        </p>
      )}
      <div>
        <div className="grid grid-cols-4 mb-2">
          <div>Номер команды</div> <div>Название команды</div>{" "}
          <div>Финальный счет</div> <div>Статус</div>
        </div>
        {teams.map((team) => (
          <div
            key={team.id}
            onClick={() => selectTeam(team)}
            className="cursor-pointer p-2 hover:bg-gray-200 grid grid-cols-4"
          >
            <div>{team.customId}</div> <div>{team.name}</div>{" "}
            <div>{team.finalScore}</div>
            <div
              className={
                team.status === "дисквалифицирован"
                  ? "text-red-500"
                  : team.status === "завершен"
                  ? "text-green-500"
                  : team.status === "в ожидании"
                  ? "text-blue-500"
                  : ""
              }
            >
              {team.status}
            </div>
          </div>
        ))}
      </div>
      {editTeamId && (
        <div className="mt-4">
          <h3 className="font-semibold">Оценить команду</h3>
          {[1, 2, 3, 4, 5].map((num) => (
            <input
              key={num}
              type="text" // Changed from "number" to "text"
              placeholder={`Судья ${num}`}
              className="p-2 border rounded mb-2"
              value={
                scores[`scoreJudge${num}`] === 0
                  ? ""
                  : scores[`scoreJudge${num}`]
              } // Show empty string if score is 0
              onChange={(e) => {
                const value = e.target.value;
                // Ensure that only numeric values are set
                setScores({
                  ...scores,
                  [`scoreJudge${num}`]: value === "" ? 0 : Number(value), // Convert to number or set to 0 if empty
                });
              }}
              onFocus={(e) => {
                // Remove '0' on focus
                if (e.target.value === "0") {
                  e.target.value = "";
                }
              }}
            />
          ))}
          <button
            onClick={updateScores}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Сохранить оценки и статус
          </button>
        </div>
      )}
    </div>
  );
};

export default EditorDashboard;
