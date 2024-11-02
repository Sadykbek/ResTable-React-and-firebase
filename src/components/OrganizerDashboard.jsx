import React, { useState, useEffect } from "react";
import { db } from "../assets/firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  getDoc,
  setDoc,
} from "firebase/firestore";
import ViewerDashboard from "./ViewerDashboard";

const OrganizerDashboard = () => {
  const [teamName, setTeamName] = useState("");
  const [customId, setCustomId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getCounter = async () => {
      const counterDoc = doc(db, "counters", "teamsCounter");
      const counterSnap = await getDoc(counterDoc);
      if (counterSnap.exists()) {
        setCustomId(counterSnap.data().lastId + 1);
      } else {
        await setDoc(counterDoc, { lastId: 0 });
        setCustomId(0);
      }
    };
    getCounter();
  }, []);

  const addTeam = async () => {
    if (!teamName || customId === null) {
      setMessage("Заполните все поля.");
      return;
    }
    try {
      await addDoc(collection(db, "teams"), {
        customId: customId,
        name: teamName,
        scoreJudge1: 0,
        scoreJudge2: 0,
        scoreJudge3: 0,
        scoreJudge4: 0,
        scoreJudge5: 0,
        status: "участвует",
      });

      const counterDoc = doc(db, "counters", "teamsCounter");
      await updateDoc(counterDoc, { lastId: customId });
      setMessage("Команда добавлена!");
      setTeamName("");
      setCustomId(customId + 1);
    } catch (e) {
      setMessage("Ошибка при добавлении команды.");
    }
  };

  return (
    <>
      <div className="p-4 bg-gray-100 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">Добавить новую команду</h2>
        {message && <p>{message}</p>}
        <input
          className="p-2 border rounded mb-2"
          type="text"
          placeholder="Имя команды"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <button
          onClick={addTeam}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Добавить команду
        </button>
      </div>
      <ViewerDashboard />
    </>
  );
};

export default OrganizerDashboard;
