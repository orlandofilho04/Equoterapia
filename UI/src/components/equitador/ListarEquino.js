import React, { useEffect, useState } from 'react';
import './ListarEquino.css'; 
import SearchBar from "../SearchBar.js";
import { Link } from 'react-router-dom';
import { format, subHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from "../../services/api";


const ListarEquino = () => {
 /* const [equinosAtivos, setEquinosAtivos] = useState([
    { id: 1, nome: "Alfa", idade: "6 Anos", dataCadastro: "5 Dez 2024 15:59 PM" },
    { id: 2, nome: "Primavera", idade: "7 Anos", dataCadastro: "17 Nov 2024 7:30 AM" },
    { id: 3, nome: "Canela", idade: "10 Anos", dataCadastro: "17 Jan 2024 9:00 AM" },
    { id: 4, nome: "Flash", idade: "12 Anos", dataCadastro: "17 Set 2024 16:40 PM" },
  ]);

  const [equinosArquivados, setEquinosArquivados] = useState([
    { id: 5, nome: "Thor", idade: "8 Anos", dataCadastro: "20 Mar 2023 10:00 AM" },
    { id: 6, nome: "Relâmpago", idade: "9 Anos", dataCadastro: "22 Ago 2023 12:00 PM" },
  ]);*/
  const [equinosAtivos, setEquinosAtivos] = useState([]);
  const [equinosArquivados, setEquinosArquivados] = useState([]);
    useEffect(() => {
      const loadHorse = async () => {
        const response = await api.get(`/horses`);
       // setEquinosAtivos(response.data[0].STATUS=);
   
       const ativos = [];
      const arquivados = [];
        for(let i = 0; i < response.data.length; i++ ){
          if(response.data[i].status === "ARQUIVADO"){
            arquivados.push(response.data[i]);
            
          }else{
            ativos.push(response.data[i]);
           
          }
            
          }
          setEquinosAtivos(ativos);
          setEquinosArquivados(arquivados);
        }
       
        loadHorse();
    }, [])
  


  

 
  const [exibirAtivos, setExibirAtivos] = useState(true);

  return (
    <div className="container">
      <h1 className="page-title">Equinos Cadastrados</h1>
      <SearchBar className="listar-equinos-searchbar" />
      
      <div className="button-group">
        {/* Botões ajustados */}
        <button
          className={`button-filter me-2 ${
            exibirAtivos ? "btn-active" : "btn-outline-secondary"
          }`}
          onClick={() => setExibirAtivos(true)}
        >
          Equinos Ativos
        </button>
        <button
          className={`button-filter ${
            !exibirAtivos ? "btn-active" : "btn-outline-secondary"
          }`}
          onClick={() => setExibirAtivos(false)}
        >
          Equinos Arquivados
        </button>
        <Link to="/cadastrar-equino" className="button-add btn">Cadastre um novo Equino</Link>
      </div>

      <hr className="divider" />

      <div className="listar-equinos">
      {(exibirAtivos ? equinosAtivos : equinosArquivados).map((equino)  => ( 
         
          <div key={equino.id} className="item-container d-flex align-items-center">
            <Link to="/dados-equino">
            <img
              src= {equino.photo ? equino.photo : "https://img.freepik.com/fotos-gratis/bela-vista-de-um-magnifico-cavalo-branco-com-o-campo-verde_181624-14424.jpg?t=st=1732245856~exp=1732249456~hmac=04d8eb3ea75eb418bdfca534b6ad1dcdf726f0a8155d9011bac86f34e12f7aaa&w=740"}
              alt="Equino"
              className="avatar me-3"
            />
            </Link>
            <div className="info">
              <p className="text mb-0"><b>{equino.name}</b></p>
              <p className="text mb-0">Idade: {equino.age}</p>
              <p className="text mb-0">
                Data de cadastro: {
                  format(subHours(new Date(equino.createdAt), 3), "dd MMM yyyy, hh:mm a", { locale: ptBR })
                }
              </p>
            </div>
            <div className="status text-end me-3">
            <span className={`status-text ${exibirAtivos ? "text-success" : "text-danger"}`}>
            {exibirAtivos ? "Status: Ativo" : "Status: Arquivado"}
              </span>
            </div>
            <button className="action-button">
              {exibirAtivos ? "Arquivar Equino" : "Desarquivar Equino"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListarEquino;
