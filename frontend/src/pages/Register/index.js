import React, { useState } from "react";
import "./styles.css";
import { FiArrowLeft } from "react-icons/fi";
import api from "../services/api";

import logoImg from "../../assets/logo.svg";
import { Link, useHistory } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");

  const history = useHistory()

  function handleRegister(e) {
    e.preventDefault(); //impede que a pagina atualize

    const payload = {
      name,
      email,
      whatsapp,
      city,
      uf
    };

    return api
      .post("/ongs", payload)
      .then(res => alert(`Seja bem vindo, seu login é ${res.data.id}`))
      .then(() => history.push('/'))
      .catch(() => alert("Ocorreu um erro ao cadastrar, tente novamente mais tarde"));
  }

  return (
    <div className="register-container">
      <div className="content">
        <section>
          <img src={logoImg} alt="Be the Hero" />
          <h1>Cadastro</h1>
          <p>
            Faça seu cadastro, entre na plataforma e ajude pessoas a encontrarem
            os casos da sua ONG.
          </p>
          <Link className="back-link" to="/">
            <FiArrowLeft size={16} color={"#e02041"} />
            Voltar para logon
          </Link>
        </section>
        <form onSubmit={handleRegister}>
          <input
            placeholder="Nome da Ong"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <input
            placeholder="WhatsApp"
            value={whatsapp}
            type="number"
            maxLength={11}
            onChange={e => setWhatsapp(e.target.value)}
          />

          <div className="input-group">
            <input
              placeholder="Cidade"
              value={city}
              onChange={e => setCity(e.target.value)}
            />
            <input
              placeholder="UF"
              style={{ width: 80 }}
              value={uf}
              maxLength={2}
              onChange={e => setUf(e.target.value)}
            />
          </div>

          <button className="button" type="submit">
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
