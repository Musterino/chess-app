import React, { useRef, useState } from 'react';
import Tile from '../Tile/Tile';
import './Chessboard.css';

// chessboard markings
const hAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
const vAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];

// interface for piece image
interface Piece {
    image: string;
    hPos: number;
    vPos: number;
}

// initialize chessboard
const initBoardState: Piece[] = [];
for (let c = 0; c < 2; c++) {
    const type = c === 0 ? "w" : "b";
    const vPos = c === 0 ? 0 : 7;
    const pawnPos = c === 0 ? 1 : 6;
    // add pawns
    for (let i = 0; i < 8; i++) {
        initBoardState.push({image: `assets/images/pawn_${type}.png`, vPos: pawnPos, hPos: i})
    }
    // add the rest of pieces
    initBoardState.push({image: `assets/images/rook_${type}.png`, vPos, hPos: 0})
    initBoardState.push({image: `assets/images/knight_${type}.png`, vPos, hPos: 1})
    initBoardState.push({image: `assets/images/bishop_${type}.png`, vPos, hPos: 2})
    initBoardState.push({image: `assets/images/queen_${type}.png`, vPos, hPos: 3})
    initBoardState.push({image: `assets/images/king_${type}.png`, vPos, hPos: 4})
    initBoardState.push({image: `assets/images/bishop_${type}.png`, vPos, hPos: 5})
    initBoardState.push({image: `assets/images/knight_${type}.png`, vPos, hPos: 6})
    initBoardState.push({image: `assets/images/rook_${type}.png`, vPos, hPos: 7})
}


export default function Chessboard() {
    // list of elements on the board
    let board = [];

    const [pieces, setPieces] = useState<Piece[]>(initBoardState);
    const chessboardRef = useRef<HTMLDivElement>(null);

    // save piece state which is being moved
    const [movedPiece, setMovedPiece] = useState<HTMLElement | null>(null);
    // save current state of the board
    const [gridH, setGridH] = useState(0);
    const [gridV, setGridV] = useState(0);
   

    // event handle when one grabs a piece
    function grabPiece(e: React.MouseEvent) {
        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;
        if (element.classList.contains("chess-piece") && chessboard) {
            setGridH(Math.floor((e.clientX - chessboard.offsetLeft) / 100));
            setGridV(Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100)));
            const h = e.clientX - 50;
            const v = e.clientY - 50;
            element.style.position = "absolute";
            element.style.left = `${h}px`;
            element.style.top = `${v}px`;
            setMovedPiece(element);
        }
        console.log(gridV, gridH);
    }

    // event handle when one moves a piece after grabbing it
    function movePiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if (movedPiece && chessboard) {
            const minX = chessboard.offsetLeft - 25;
            const minY = chessboard.offsetTop - 25;
            const maxX = minX + chessboard.clientWidth - 50;
            const maxY = minY + chessboard.clientHeight - 50;
            const x = e.clientX - 50;
            const y = e.clientY - 50;
            movedPiece.style.position = "absolute";

            if (x < minX) {
                movedPiece.style.left = `${minX}px`;
            } else if (x > maxX) {
                movedPiece.style.left = `${maxX}px`;
            } else {
                movedPiece.style.left = `${x}px`;
            }
            if (y < minY) {
                movedPiece.style.top = `${minY}px`;
            } else if (y > maxY) {
                movedPiece.style.top = `${maxY}px`;
            } else {
                movedPiece.style.top = `${y}px`;
            }
        }
    }

    // event handle when one drops a piece
    function dropPiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if (movedPiece && chessboard) {
            const h = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
            const v = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100));
            console.log(h,v);
            setPieces((value) => {
               const pieces = value.map((p) => {
                   if (p.hPos === gridH && p.vPos === gridV) {
                        p.hPos = h;
                        p.vPos = v;
                   }
                    return p;
                })
                return pieces;
            });
            setMovedPiece(null);
        }
    }

    // create tiles for the board
    for(let vert = vAxis.length-1; vert >= 0; vert--) {
        for(let horiz = 0; horiz < hAxis.length; horiz++) {
            let number = horiz + vert;

            let image = "";

            pieces.forEach(p => {
                if (p.hPos === horiz && p.vPos === vert) {
                    image = p.image;
                }
            })

            board.push(<Tile key={`${vert}, ${horiz}`} number={number} image={image} />)
        }
    }

    // render board
    return <div 
        onMouseUp={e => dropPiece(e)} 
        onMouseMove={e => movePiece(e)} 
        onMouseDown={e => grabPiece(e)} 
        id="chessboard"
        ref={chessboardRef}
        >
            {board}
        </div>
}