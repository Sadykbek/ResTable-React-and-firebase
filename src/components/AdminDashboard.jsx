import React, { useState, useEffect } from "react";
import { db } from "../assets/firebaseConfig";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

const AdminDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [message, setMessage] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamScore, setNewTeamScore] = useState(0);
  const [newTeamStatus, setNewTeamStatus] = useState("участвует");
  const [editTeam, setEditTeam] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "teams"), (snapshot) => {
      const teamsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Сортировка команд по customId
      teamsData.sort((a, b) => a.customId - b.customId);
      setTeams(teamsData);
    });

    return () => unsubscribe();
  }, []);

  // Добавление новой команды
  const addTeam = async () => {
    if (!newTeamName || newTeamScore === null || !newTeamStatus) {
      setMessage("Пожалуйста, заполните все поля.");
      return;
    }

    try {
      await addDoc(collection(db, "teams"), {
        name: newTeamName,
        score: newTeamScore,
        status: newTeamStatus,
        customId: teams.length > 0 ? teams[teams.length - 1].customId + 1 : 0, // автоинкремент ID
      });
      setMessage("Команда успешно добавлена!");
      setNewTeamName("");
      setNewTeamScore(0);
      setNewTeamStatus("участвует");
    } catch (e) {
      setMessage("Ошибка при добавлении команды.");
    }
  };

  // Обновление существующей команды
  const updateTeam = async (teamId, updatedFields) => {
    try {
      const teamDoc = doc(db, "teams", teamId);
      await updateDoc(teamDoc, updatedFields);
      setMessage("Команда успешно обновлена!");
      setEditTeam(null);
    } catch (e) {
      setMessage("Ошибка при обновлении команды.");
    }
  };

  // Удаление команды
  const deleteTeam = async (teamId) => {
    try {
      await deleteDoc(doc(db, "teams", teamId));
      setMessage("Команда успешно удалена.");
    } catch (e) {
      setMessage("Ошибка при удалении команды.");
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        Админ-панель управления командами
      </h2>
      {message && <p>{message}</p>}

      {/* Форма для добавления новой команды */}
      <div className="mb-4">
        <h3 className="font-semibold">Добавить новую команду</h3>
        <input
          type="text"
          placeholder="Имя команды"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          className="p-2 border rounded mb-2"
        />
        <input
          type="number"
          placeholder="Баллы команды"
          value={newTeamScore}
          onChange={(e) => setNewTeamScore(Number(e.target.value))}
          className="p-2 border rounded mb-2"
        />
        <select
          value={newTeamStatus}
          onChange={(e) => setNewTeamStatus(e.target.value)}
          className="p-2 border rounded mb-2"
        >
          <option value="участвует">В соревновании</option>
          <option value="дисквалифицирован">Дисквалифицирован</option>
          <option value="завершен">Завершено</option>
          <option value="waiting">В ожидании</option>
        </select>
        <button
          onClick={addTeam}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Добавить команду
        </button>
      </div>

      {/* Список команд с возможностью редактирования и удаления */}
      <div>
        <h3 className="font-semibold">Список команд</h3>
        <div className="grid grid-cols-6">
          <div>ID</div> <div>Имя</div> <div>Баллы</div> <div>Статус</div> <div></div> <div></div>
        </div>
        <ul>
          {teams.map((team) => (
            <li key={team.id} className="mb-2 p-2 border rounded">
              <div className="grid grid-cols-6 items-center ">
                <div>{team.customId}</div> <div>{team.name}</div>{" "}
                <div>{team.score}</div>
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
                <div>
                  <button
                    onClick={() => setEditTeam(team)}
                    className="mr-2 text-blue-500"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => deleteTeam(team.id)}
                    className="text-red-500"
                  >
                    Удалить
                  </button>
                </div>
              </div>
              {editTeam && editTeam.id === team.id && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Новое имя"
                    value={editTeam.name}
                    onChange={(e) =>
                      setEditTeam({ ...editTeam, name: e.target.value })
                    }
                    className="p-2 border rounded mb-2"
                  />
                  <input
                    type="number"
                    placeholder="Новая оценка"
                    value={editTeam.score}
                    onChange={(e) =>
                      setEditTeam({
                        ...editTeam,
                        score: Number(e.target.value),
                      })
                    }
                    className="p-2 border rounded mb-2"
                  />
                  <select
                    value={editTeam.status}
                    onChange={(e) =>
                      setEditTeam({ ...editTeam, status: e.target.value })
                    }
                    className="p-2 border rounded mb-2"
                  >
                    <option value="участвует">Участвует</option>
                    <option value="дисквалифицирован">
                      Дисквалифицирована
                    </option>
                    <option value="завершен">Завершено</option>
                    <option value="в ожидании">В ожидании</option>
                  </select>
                  <button
                    onClick={() => updateTeam(team.id, editTeam)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Сохранить изменения
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
