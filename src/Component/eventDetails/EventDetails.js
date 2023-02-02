import React, { useState, useEffect } from "react";
import "./eventD.css";
import axios from "axios";
import { AddEvent , colorTagMatcher } from "../../logic/function";
import Money from "../../Asset/money.png";
import Heart from "../../Asset/heart.png";
import Geo from "../../Asset/icons8-géorepérage-100.png";
import Calendar from "../../Asset/calendar.png";
import Handicap from "../../Asset/icons8-disability-64.png";
import Blind from "../../Asset/icons8-malvoyant-60.png";
import Deaf from "../../Asset/icons8-sourd-50 (1).png";
import Empty from "../../Asset/emptyHeart.png";
import useLogged from "../../logic/useLogged";

const EventDetails = (props) => {

  const [user] = useLogged();
  const token = localStorage.getItem("auth-token");

  
  const addFavorite = async (idEvent) => {
    AddEvent(idEvent)

    await axios
      .put(
        `http://localhost:3001/request/user`,
        { favoriteEvent: idEvent },
        { headers: { authorization: token } }
      )
      .then((res) => console.log(res.data))

      .catch((err) => {
        console.log(err);
      });
  };

  const removeFavorite = async (idEvent) => {
    axios
      .delete(`http://localhost:3001/request/user`, {
        data: { favoriteEvent: idEvent },
        headers: { authorization: token },
      })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };


  const split = (text) => {
    let result = text.split(";");
    return result;
  };

  return (
    <>
      <div key={props.event.fields.id} className="container">
        <div className="card">
          <div className="card-header">
            <img
              className="ico-coeur"
              src={
                user && user.favoriteEvent.includes(props.event.fields.id)
                  ? Heart
                  : Empty
              }
              alt="user"
              onClick={() =>
                user && user.favoriteEvent.includes(props.event.fields.id)
                  ? removeFavorite(props.event.fields.id)
                  : addFavorite(props.event.fields.id)
              }
            />

            <img
              className="card-img"
              src={`${props.event.fields.cover_url}`}
              alt="rover"
            />
          </div>
          <div className="card-body taged">
            {props.event.fields.tags && (
              <div className="taged">
                {split(props.event.fields.tags).map((e,i) => {
                  return (
                    <span
                      style={{ backgroundColor: colorTagMatcher(e) }}
                      className="tag"
                      key={i}
                    >
                      {e}
                    </span>
                  );
                })}
              </div>
            )}
            <h5 className="titleCard">{props.event.fields.title}</h5>

            <p className="textCard">{props.event.fields.lead_text}</p>
            <div className="line"></div>
            <div className="user">
              <div className="user-info">
                {props.event.fields.address_street &&
                  props.event.fields.address_zipcode &&
                  props.event.fields.address_city && (
                    <div className="location">
                      <img src={Geo} alt="" />
                      <div className="adress">{`${props.event.fields.address_street}  ${props.event.fields.address_zipcode}  ${props.event.fields.address_city}`}</div>
                    </div>
                  )}

                {props.event.fields.date_start && (
                  <div className="timeDate">
                    <img className="calendar" src={Calendar} alt="" />
                    <div className="date">
                      {new Date(props.event.fields.date_start)
                        .toLocaleString()
                        .slice(-20, -10)}
                    </div>
                  </div>
                )}

                <div className="handicap">
                  <div className="mob">
                    {props.event && (
                      <>
                        {props.event.fields.pmr === 1 && (
                          <>
                            <img className="pmr" src={Handicap} alt="" />
                          </>
                        )}
                      </>
                    )}
                  </div>
                  <div className="blind">
                    {props.event && (
                      <>
                        {props.event.fields.blind === 1 && (
                          <>
                            <img className="pmr" src={Blind} alt="" />
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
                {props.event.fields.price_type !== "gratuit" && (
                  <img className="ico" src={Money} alt="user" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetails;