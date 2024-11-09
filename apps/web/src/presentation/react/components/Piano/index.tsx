import { useEffect } from "react"
import './index.css'

export const Piano = function () {
    function playNote(e: KeyboardEvent) {
        const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
        const key = document.querySelector(`.key[data-key="${e?.keyCode}"]`);
        
        if (!key) return;
        
        const keyNote = key.getAttribute("data-note") || '';
        const note = document.querySelector(".nowplaying");
        
        key.classList.add("playing");
        note && (note.innerHTML = keyNote);
        if(audio) {
            const audioElement = audio as HTMLAudioElement
            audioElement.currentTime = 0;
            audioElement.play();
        }

    }
      
    function removeTransition(e: any ) {
        if (e.propertyName !== "transform") return;
        e.target.classList.remove("playing");
    }
      
    useEffect(() => {
        const keys = document.querySelectorAll(".key");
        keys.forEach(key => key.addEventListener("transitionend", removeTransition));
        window.addEventListener("keydown", playNote);
    }, [])

    return (
        <div id="main">
            <div className="nowplaying"></div>
            <div className="keys">
            <div data-key="65" className="key" data-note="C">
                <span className="hints">A</span>
            </div>
            <div data-key="87" className="key sharp" data-note="C#">
                <span className="hints">W</span>
            </div>
            <div data-key="83" className="key" data-note="D">
                <span className="hints">S</span>
            </div>
            <div data-key="69" className="key sharp" data-note="D#">
                <span className="hints">E</span>
            </div>
            <div data-key="68" className="key" data-note="E">
                <span className="hints">D</span>
            </div>
            <div data-key="70" className="key" data-note="F">
                <span className="hints">F</span>
            </div>
            <div data-key="84" className="key sharp" data-note="F#">
                <span className="hints">T</span>
            </div>
            <div data-key="71" className="key" data-note="G">
                <span className="hints">G</span>
            </div>
            <div data-key="89" className="key sharp" data-note="G#">
                <span className="hints">Y</span>
            </div>
            <div data-key="72" className="key" data-note="A">
                <span className="hints">H</span>
            </div>
            <div data-key="85" className="key sharp" data-note="A#">
                <span className="hints">U</span>
            </div>
            <div data-key="74" className="key" data-note="B">
                <span className="hints">J</span>
            </div>
            <div data-key="75" className="key" data-note="C">
                <span className="hints">K</span>
            </div>
            <div data-key="79" className="key sharp" data-note="C#">
                <span className="hints">O</span>
            </div>
            <div data-key="76" className="key" data-note="D">
                <span className="hints">L</span>
            </div>
            <div data-key="80" className="key sharp" data-note="D#">
                <span className="hints">P</span>
            </div>
            <div data-key="186" className="key" data-note="E">
                <span className="hints">;</span>
            </div>
            </div>
    
            <audio data-key="65" src="http://carolinegabriel.com/demo/js-keyboard/sounds/040.wav"></audio>
            <audio data-key="87" src="http://carolinegabriel.com/demo/js-keyboard/sounds/041.wav"></audio>
            <audio data-key="83" src="http://carolinegabriel.com/demo/js-keyboard/sounds/042.wav"></audio>
            <audio data-key="69" src="http://carolinegabriel.com/demo/js-keyboard/sounds/043.wav"></audio>
            <audio data-key="68" src="http://carolinegabriel.com/demo/js-keyboard/sounds/044.wav"></audio>
            <audio data-key="70" src="http://carolinegabriel.com/demo/js-keyboard/sounds/045.wav"></audio>
            <audio data-key="84" src="http://carolinegabriel.com/demo/js-keyboard/sounds/046.wav"></audio>
            <audio data-key="71" src="http://carolinegabriel.com/demo/js-keyboard/sounds/047.wav"></audio>
            <audio data-key="89" src="http://carolinegabriel.com/demo/js-keyboard/sounds/048.wav"></audio>
            <audio data-key="72" src="http://carolinegabriel.com/demo/js-keyboard/sounds/049.wav"></audio>
            <audio data-key="85" src="http://carolinegabriel.com/demo/js-keyboard/sounds/050.wav"></audio>
            <audio data-key="74" src="http://carolinegabriel.com/demo/js-keyboard/sounds/051.wav"></audio>
            <audio data-key="75" src="http://carolinegabriel.com/demo/js-keyboard/sounds/052.wav"></audio>
            <audio data-key="79" src="http://carolinegabriel.com/demo/js-keyboard/sounds/053.wav"></audio>
            <audio data-key="76" src="http://carolinegabriel.com/demo/js-keyboard/sounds/054.wav"></audio>
            <audio data-key="80" src="http://carolinegabriel.com/demo/js-keyboard/sounds/055.wav"></audio>
            <audio data-key="186" src="http://carolinegabriel.com/demo/js-keyboard/sounds/056.wav"></audio>
        </div>
    )
  }