import React, { useState, useEffect } from "react";
import '../styles/coming-soon.css';

// images
import chartImage from "../media/image/chart_image.webp";
import BoxImage from "../media/image/box-image.webp";
import DashboardImage from "../media/image/Panel_image.webp";
import card from "../media/image/Card_image.webp";

const Video = () => {
    const [visibleLines, setVisibleLines] = useState([0, 1, 2, 3]); 
    const [direction, setDirection] = useState("remove"); 
    const [currentIndex, setCurrentIndex] = useState(0); 
    const maxLines = 4;

    useEffect(() => {
        const updateVisibleLines = () => {
            if (direction === "remove") {
                if (currentIndex < maxLines) {
                    setVisibleLines((prevLines) => prevLines.filter((line) => line !== currentIndex));
                    setCurrentIndex(currentIndex + 1);
                } else {
                    setDirection("add");
                    setCurrentIndex(maxLines - 1);
                }
            } else if (direction === "add") {
                if (currentIndex >= 0) {
                    setVisibleLines((prevLines) => [currentIndex, ...prevLines]);
                    setCurrentIndex(currentIndex - 1);
                } else {
                    setDirection("remove");
                    setCurrentIndex(0);
                }
            }
        };

        const interval = setInterval(() => {
            updateVisibleLines(); 
        }, 3000);

        const startTransition = () => {
            const timeout = setTimeout(() => {
                updateVisibleLines();
            }, 2000);

            return () => clearTimeout(timeout);
        };
        startTransition(); 

        return () => {
            clearInterval(interval); 
        };
    }, [currentIndex, direction]);

    return (
        <div className="video-container">
            <div className="center-div">
                <div className={`lines line-five ${visibleLines.includes(0) ? 'show' : 'hide'}`}></div>
                <div className={`lines line-four ${visibleLines.includes(1) ? 'show' : 'hide'}`}></div>
                <div className={`lines line-three ${visibleLines.includes(2) ? 'show' : 'hide'}`}></div>
                <div className={`lines line-two ${visibleLines.includes(3) ? 'show' : 'hide'}`}></div>
                <div className="lines first-column"></div>
                <div className="lines second-column "></div>
                <div className="lines third-column"></div>
                <div className="lines fourth-column"></div>
                <div className="lines fifth-column"></div>
                <div className="lines fourth-column"></div>
                <div className="lines third-column"></div>
                <div className="lines second-column"></div>
                <div className="lines first-column"></div>
                <div className={`lines line-two ${visibleLines.includes(3) ? 'show' : 'hide'}`}></div>
                <div className={`lines line-three ${visibleLines.includes(2) ? 'show' : 'hide'}`}></div>
                <div className={`lines line-four ${visibleLines.includes(1) ? 'show' : 'hide'}`}></div>
                <div className={`lines line-five ${visibleLines.includes(0) ? 'show' : 'hide'}`}></div>
            </div>

            <div className="animation-div">
                <div className="chart-div">
                    <div className="animated-chart">
                        <img src={chartImage} alt="chart" />
                    </div>
                    <div className="message-box-div">
                        <img src={BoxImage} alt="message-box" />
                    </div>
                </div>
                <div className="center-image">
                    <img src={DashboardImage} alt="panel" />
                </div>
                <div className="card-div">
                    <img src={card} alt="card" />
                </div>
            </div>
        </div>
    );
};

export default Video;
