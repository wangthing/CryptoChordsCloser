import { useCallback, useContext, useEffect, useRef, useState } from "react"
import './index.css'
import { TransactionsPresenterState } from "../../../common/presenter/transactions/TransactionsPresenterState"
import { usePresenter } from "../../hooks/usePresenter"
import { OptionsPresenter } from '../../../common/presenter/options/OptionsPresenter'
import { OptionsPresenterState } from '../../../common/presenter/options/OptionsPresenterState'
import { TransactionsPresenter } from "../../../common/presenter/transactions/TransactionsPresenter"
import { presenters } from "../../context"
import { TxTypesEnum } from "@cryptochords/shared"
const PianoKeyList = [
    {
        "key": "65",
        "src": "http://carolinegabriel.com/demo/js-keyboard/sounds/040.wav"
    },
    {
        "key": "87",
        "src": "http://carolinegabriel.com/demo/js-keyboard/sounds/041.wav"
    },
    {
        "key": "83",
        "src": "http://carolinegabriel.com/demo/js-keyboard/sounds/042.wav"
    },
    {
        "key": "69",
        "src": "http://carolinegabriel.com/demo/js-keyboard/sounds/043.wav"
    },
    {
        "key": "68",
        "src": "http://carolinegabriel.com/demo/js-keyboard/sounds/044.wav"
    },
    {
        "key": "70",
        "src": "http://carolinegabriel.com/demo/js-keyboard/sounds/045.wav"
    },
    {
        "key": "84",
        "src": "http://carolinegabriel.com/demo/js-keyboard/sounds/046.wav"
    },
    {
        "key": "71",
        "src": "http://carolinegabriel.com/demo/js-keyboard/sounds/047.wav"
    },
    {
        "key": "89",
        "src": "http://carolinegabriel.com/demo/js-keyboard/sounds/048.wav"
    },
    {
        "key": "72",
        "src": "http://carolinegabriel.com/demo/js-keyboard/sounds/049.wav"
    },
    {
        "key": "85",
        "src": "http://carolinegabriel.com/demo/js-keyboard/sounds/050.wav"
    },
    {
        "key": "74",
        "src": "http://carolinegabriel.com/demo/js-keyboard/sounds/051.wav"
    },
    {
        "key": "75",
        "src": "http://carolinegabriel.com/demo/js-keyboard/sounds/052.wav"
    },
    {
        "key": "79",
        "src": "http://carolinegabriel.com/demo/js-keyboard/sounds/053.wav"
    },
    {
        "key": "76",
        "src": "http://carolinegabriel.com/demo/js-keyboard/sounds/054.wav"
    },
    {
        "key": "80",
        "src": "http://carolinegabriel.com/demo/js-keyboard/sounds/055.wav"
    },
    {
        "key": "186",
        "src": "http://carolinegabriel.com/demo/js-keyboard/sounds/056.wav"
    }
]
TxTypesEnum
const getKeyFromTxType = (type: string) => {
    switch (type) {
        case 'ETH BLK':
            return '65'
        case 'ETH':
            return '68'
        case 'PoP':
            return '71'
        case 'BTC':
            return '76'
        case 'BTC BLK':
            return '186'
         case 'Bridge':
            return '79'
        default:
            return '186'
    }
}
export const Piano = function () {
    const { optionsPresenter } = useContext(presenters)
    const { muted } = usePresenter<OptionsPresenter, OptionsPresenterState>(optionsPresenter)
    const { transactionsPresenter } = useContext(presenters)
    const { transactions } = usePresenter<TransactionsPresenter, TransactionsPresenterState>(transactionsPresenter)
    const [totalTx, setTotalTx] = useState<TransactionsPresenterState['transactions']>([])
    const txRef = useRef(totalTx);
    useEffect(() => {
        setTotalTx([...totalTx, ...transactions])
    }, [transactions])
    console.log(transactions)
    useEffect(() => {
        txRef.current = totalTx;

    }, [totalTx])

    const playNote =  useCallback((key: number) => {
        if(muted) {
            return
        }
        if (!key) return;
        const keyEle = document.querySelector(`.key[data-key="${key}"]`);
        const keyNote = keyEle?.getAttribute("data-note") || '';
        keyEle && keyEle.classList.add("playing");
        const audio = document.querySelector(`audio[data-key="${key}"]`) as HTMLAudioElement | null;
        const note = document.querySelector(".nowplaying");
        
        note && (note.innerHTML = keyNote);
        if(audio) {
            audio.currentTime = 0;
            audio.play();
        }

    }, [muted])
    const playNoteRef = useRef(playNote);
    useEffect(() => {
        playNoteRef.current = playNote
    }, [playNote])
    function removeTransition(e: any ) {
        if (e.propertyName !== "transform") return;
        e.target.classList.remove("playing");
    }

    // function onKeyDown (e: KeyboardEvent) {
    //     const key = document.querySelector(`.key[data-key="${e?.keyCode}"]`);
    //     if(key) {
    //         playNote(e?.keyCode)
    //     }

    // }
    

    useEffect(() => {
        const keys = document.querySelectorAll(".key");
        keys.forEach(key => key.addEventListener("transitionend", removeTransition));
        // window.addEventListener("keydown", onKeyDown);

        const timeId =  setInterval(() => {
            const txList = txRef.current
            if(txList.length) {
                // sort by tx type
                const curTx = txList[0]
                const { type } = curTx
                const key = getKeyFromTxType(type)
                // const curIndex = Math.floor(Math.random() * PianoKeyList.length)
                // const randomKey = PianoKeyList[curIndex].key
                setTotalTx(txList.splice(1))
                playNoteRef.current(Number(key))
                playNoteRef.current(71)
            }
        }, 400);
        return () => clearInterval(timeId)
    }, [])

    return (
        <div id="main">
            {/* <div className="nowplaying"></div> */}
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
            {
                PianoKeyList.map(item => <audio data-key={item.key} src={item.src}></audio>)
            }
        </div>
    )
  }
