import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./styles.css";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import logoImg from "../../assets/logo.svg";
import api from "../services/api";

export default function NewIncident() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const history = useHistory();
  const ongId = localStorage.getItem('ongId')

  function handleSubmit(e) {
    e.preventDefault()

    if(!value || !description || !title){
      return alert('Preencha todos os campos!')
    }

    const payload = {
      title,
      description,
      value
    };

    return api.post('/incidents', payload, {
      headers: {Authorization: ongId}
    }).then(() => {
      alert('Caso cadastrado com sucesso!')
      history.push('/profile')
    }).catch(() => alert('Erro ao cadastrar um novo incidente, tente mais tarde!'))
  }

  return (
    <div className="new-incident-container">
      <div className="content">
        <section>
          <img src={logoImg} alt="Be the Hero" />
          <h1>Cadastrar novo caso</h1>
          <p>
            Descreva o caso detalhadamente para encontrar um herói para resolver
            isso.
          </p>
          <Link className="back-link" to="/profile">
            <FiArrowLeft size={16} color={"#e02041"} />
            Voltar para home
          </Link>
        </section>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Titulo do caso"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <textarea
            placeholder="descrição"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <input
            placeholder="Valor em reais"
            value={value}
            type={'number'}
            onChange={e => setValue(e.target.value)}
          />

          <button className="button" type="submit">
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
