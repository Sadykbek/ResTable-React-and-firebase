import React, { useEffect, useState } from "react";
import { db } from "../assets/firebaseConfig";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";

const ViewerDashboard = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "teams"), (snapshot) => {
      const teamsData = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => a.customId - b.customId);

      setTeams(teamsData);
      updateInProgressStatus(teamsData);
    });

    return () => unsubscribe();
  }, []);

  const updateInProgressStatus = async (teams) => {
    let inProgressFound = false;

    for (const team of teams) {
      const teamDoc = doc(db, "teams", team.id);

      if (team.status === "завершен" && !inProgressFound) {
        const nextTeam = teams.find((t) => t.customId === team.customId + 1);
        if (nextTeam && nextTeam.status === "участвует") {
          await updateDoc(doc(db, "teams", nextTeam.id), {
            status: "в ожидании",
          });
          inProgressFound = true;
        }
      }
    }
  };

  return (
    <div className=" bg-gray-100 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Просмотр команд</h2>
      <div>
        <div className="grid grid-cols-3">
          <div>Номер команды</div>
          <div>Название команды</div>
          <div>Статус</div>
        </div>
        {teams.map((team) => (
          <div
            key={team.id}
            className={
              team.status === "завершен"
                ? "bg-gray-300 p-4 border-b grid grid-cols-3":
                team.status === "дисквалифицирован"
                ? "bg-red-100 p-4 border-b grid grid-cols-3":
                team.status === "в ожидании"
                ? "bg-blue-100 p-4 border-b grid grid-cols-3"
                : "p-2 border-b grid grid-cols-3"
            }
          >
            <div>{team.customId}</div>
            <div>{team.name}</div>
            <div
              className={
                team.status === "завершен"
                  ? "text-green-500"
                  : team.status === "дисквалифицирован"
                  ? "text-red-500"
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
    </div>
  );
};

export default ViewerDashboard;
