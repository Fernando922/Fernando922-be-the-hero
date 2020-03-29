import React, { useState, useEffect } from "react";
import "./styles.css";
import { Link, useHistory } from "react-router-dom";
import { FiPower, FiTrash2 } from "react-icons/fi";
import api from "../services/api";

import logoImg from "../../assets/logo.svg";

export default function Profile() {
  const ongName = localStorage.getItem("ongName");
  const ongId = localStorage.getItem("ongId");
  const history = useHistory();
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    function getCases() {
      return api.get(`/profile`, {
        headers: { Authorization: ongId }
      });
    }

    getCases()
      .then(res => setIncidents(res.data))
      .catch(() =>
        alert("Ocorreu um erro ao buscar os casos, tente novamente mais tarde")
      );
  }, [ongId]);

  function handleRemoveIncident(id) {
    function removeIncidentFromList(id) {
      const newIncidents = incidents.filter(incidents => incidents.id !== id);
      setIncidents(newIncidents);
    }

    api
      .delete(`/incidents/${id}`, {
        headers: { Authorization: ongId }
      })
      .then(() => removeIncidentFromList(id))
      .catch(() =>
        alert("Ocorreu um erro ao excluir, tente novamente mais tarde")
      );
  }


  function handleLogout(){
    localStorage.clear()
    history.push('/')
  }

  return (
    <div className="profile-container">
      <header>
        <img src={logoImg} alt="Be the Hero" />
        <span>Bem vinda, {ongName}!</span>
        <Link to="/incidents/new" className="button">
          Cadastrar novo caso
        </Link>
        <button onClick={handleLogout}>
          <FiPower size={18} color="#e02041" />
        </button>
      </header>

      <h1>Casos cadastrados</h1>
      <ul>
        {incidents.length > 0 &&
          incidents.map(incident => (
            <li key={incident.id}>
              <strong>CASO:</strong>
              <p>{incident.title}</p>
              <strong>DESCRIÇÃO:</strong>
              <p>{incident.description}</p>
              <strong>VALOR:</strong>
              <p>
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                }).format(incident.value)}
              </p>

              <button onClick={() => handleRemoveIncident(incident.id)}>
                <FiTrash2 size={20} color="#a8a8b3" />
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
