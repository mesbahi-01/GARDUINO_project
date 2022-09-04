import React, { useEffect } from "react"
import { useState } from "react"
import axios from 'axios'
import sunRise from "../images/sunRise.png"
import sunSet from "../images/sunSet.png"
import temperatur_ from "../images/temperatur.png"
import Button from '@mui/material/Button'
import time from '../images/time.png'
import SendIcon from '@mui/icons-material/Send'
import humidity_ from '../images/humidity.png'
const Forcast = () => {

    const [currentTime, setCurrentTime] = useState("");
    const [color, setColor] = useState("primary");

    const [feelLike, setFeelLike] = useState(0);
    const [humidity, setHumidity] = useState(0);

    const [sunSet_, setSunSet_] = useState(0);
    const [sunRise_, setSunRise_] = useState(0);

    const fetchWeather = () => {
        // Checking if geolocation is available
        if ("geolocation" in navigator) {
            // get coordinates
            navigator.geolocation.getCurrentPosition(function (position) {
                let lat = position.coords.latitude;
                let long = position.coords.longitude;
                localStorage.setItem("summerx_lat", lat);
                localStorage.setItem("summerx_long", long);
                localStorage.setItem("summerx_locationPermission", true);
                // after getting coordinates, we will use API to get weather info
                // https://api.openweathermap.org/data/2.5/weather?lat=34.0368&lon=-5.0008&units=metric&appid=ccc0aef09260420369d2c887f3c84dcb
                axios(
                    "https://api.openweathermap.org/data/2.5/weather?lat=34.0368&lon=-5.0008&units=metric&appid=ccc0aef09260420369d2c887f3c84dcb"
                )
                    .then((res) => {
                        // Assigning data if the res-status is OK
                        if (res.status >= 200 || res.status < 300) {
                            const base = res.data.main;
                            setFeelLike(parseInt(base.feels_like));
                            setHumidity(parseInt(base.humidity));
                            setSunRise_(() => new Date(res.data.sys.sunrise).toLocaleTimeString());
                            setSunSet_(() => new Date(res.data.sys.sunset + 47220000).toLocaleTimeString());
                        }
                    }).catch((error) => console.log(error))
            })
        } else {
            alert("Unable to get Location permission");
        }
    }

    // send a Text message to the aduino 
    const sendText = _ => {
        fetch(`/send-text`)
            .then(res => {
                if (res.status >= 200 && res.status <= 299) {
                    setColor("success")
                    setTimeout(() => setColor("primary"), 3000)
                }
                else {
                    setColor("secondry")
                    setTimeout(() => setColor("primary"), 3000)
                }
            })
            .catch((err) => {
                // alert('Something went wrong please try again')
                console.log(err)
            })
    }
    useEffect(() => fetchWeather(), []);
    setInterval(fetchWeather, 900000); // update the weather every 15 minutes
    // update the locale time every 1 second 
    setInterval(() => {
        setCurrentTime(() => {
            let current_time = new Date();
            return current_time.toLocaleTimeString().slice(0, 8);
        });
    }, 1000);

    return (
        <header className="item1">
            <img src={time} alt="" className="time_img" />
            <span className="time">{currentTime}</span>
            <img src={temperatur_} alt="" />
            <span className="comment">Feels Like {feelLike}°C</span>
            <img src={humidity_} alt="" />
            <span className='humidity'>humidity {humidity}%</span>
            <img src={sunRise} alt="" className="sun_rise_set" />
            <span>{sunRise_}</span>
            <img src={sunSet} alt="" className="sun_rise_set" />
            <span>{sunSet_}</span>
            <Button variant="contained" onClick={sendText} endIcon={<SendIcon />} color={color}>
                Send
            </Button>
        </header>
    )
}
export default Forcast;