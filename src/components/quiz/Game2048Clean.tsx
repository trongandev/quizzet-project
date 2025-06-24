"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trophy, HelpCircle, X, Target, SlidersHorizontal, Scale } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Game2048Props {
    onClose?: () => void;
}

export function Game2048({ onClose }: Game2048Props) {
    const [board, setBoard] = useState<number[][]>(() =>
        Array(4)
            .fill(null)
            .map(() => Array(4).fill(0))
    );
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

    // Load best score from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("2048-best-score");
        if (saved) setBestScore(parseInt(saved));
    }, []);

    // Save best score
    useEffect(() => {
        if (score > bestScore) {
            setBestScore(score);
            localStorage.setItem("2048-best-score", score.toString());
        }
    }, [score, bestScore]);

    // Get tile color based on value
    const getTileColor = (value: number) => {
        const colors: Record<number, string> = {
            2: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700",
            4: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700",
            8: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700",
            16: "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 border-orange-300 dark:border-orange-700",
            32: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700",
            64: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700",
            128: "bg-pink-200 dark:bg-pink-800 text-pink-900 dark:text-pink-100 border-pink-400 dark:border-pink-700",
            256: "bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-100 border-indigo-400 dark:border-indigo-700",
            512: "bg-cyan-200 dark:bg-cyan-800 text-cyan-900 dark:text-cyan-100 border-cyan-400 dark:border-cyan-700",
            1024: "bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 border-emerald-400 dark:border-emerald-700",
            2048: "bg-yellow-300 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 border-yellow-500 dark:border-yellow-400 shadow-lg ring-2 ring-yellow-400 dark:ring-yellow-500",
        };
        return colors[value] || "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-500 dark:border-gray-600";
    };

    // Add random tile
    const addRandomTile = useCallback((currentBoard: number[][]) => {
        const emptyCells: Array<[number, number]> = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (currentBoard[r][c] === 0) {
                    emptyCells.push([r, c]);
                }
            }
        }

        if (emptyCells.length > 0) {
            const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const newBoard = currentBoard.map((row) => [...row]);
            newBoard[row][col] = Math.random() < 0.9 ? 2 : 4;
            return newBoard;
        }
        return currentBoard;
    }, []);

    // Move tiles logic
    const moveLeft = useCallback(
        (currentBoard: number[][]) => {
            const newBoard = currentBoard.map((row) => [...row]);
            let newScore = 0;
            let moved = false;

            for (let r = 0; r < 4; r++) {
                let row = newBoard[r].filter((val) => val !== 0);

                for (let i = 0; i < row.length - 1; i++) {
                    if (row[i] === row[i + 1]) {
                        row[i] *= 2;
                        newScore += row[i];
                        row[i + 1] = 0;
                        if (row[i] === 2048 && !gameWon) {
                            setGameWon(true);
                        }
                    }
                }

                row = row.filter((val) => val !== 0);
                while (row.length < 4) {
                    row.push(0);
                }

                for (let i = 0; i < 4; i++) {
                    if (newBoard[r][i] !== row[i]) {
                        moved = true;
                    }
                }

                newBoard[r] = row;
            }

            return { board: newBoard, score: newScore, moved };
        },
        [gameWon]
    );

    const moveRight = useCallback(
        (currentBoard: number[][]) => {
            const flipped = currentBoard.map((row) => [...row].reverse());
            const result = moveLeft(flipped);
            return {
                ...result,
                board: result.board.map((row) => [...row].reverse()),
            };
        },
        [moveLeft]
    );

    const moveUp = useCallback(
        (currentBoard: number[][]) => {
            const transposed = Array(4)
                .fill(null)
                .map((_, i) =>
                    Array(4)
                        .fill(null)
                        .map((_, j) => currentBoard[j][i])
                );
            const result = moveLeft(transposed);
            return {
                ...result,
                board: Array(4)
                    .fill(null)
                    .map((_, i) =>
                        Array(4)
                            .fill(null)
                            .map((_, j) => result.board[j][i])
                    ),
            };
        },
        [moveLeft]
    );

    const moveDown = useCallback(
        (currentBoard: number[][]) => {
            const transposed = Array(4)
                .fill(null)
                .map((_, i) =>
                    Array(4)
                        .fill(null)
                        .map((_, j) => currentBoard[j][i])
                );
            const result = moveRight(transposed);
            return {
                ...result,
                board: Array(4)
                    .fill(null)
                    .map((_, i) =>
                        Array(4)
                            .fill(null)
                            .map((_, j) => result.board[j][i])
                    ),
            };
        },
        [moveRight]
    );

    const isGameOver = useCallback((currentBoard: number[][]) => {
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (currentBoard[r][c] === 0) return false;
            }
        }

        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const current = currentBoard[r][c];
                if ((r < 3 && currentBoard[r + 1][c] === current) || (c < 3 && currentBoard[r][c + 1] === current)) {
                    return false;
                }
            }
        }

        return true;
    }, []);

    const handleMove = useCallback(
        (direction: "left" | "right" | "up" | "down") => {
            if (gameOver) return;

            let result;
            switch (direction) {
                case "left":
                    result = moveLeft(board);
                    break;
                case "right":
                    result = moveRight(board);
                    break;
                case "up":
                    result = moveUp(board);
                    break;
                case "down":
                    result = moveDown(board);
                    break;
            }

            if (result.moved) {
                const newBoard = addRandomTile(result.board);
                setBoard(newBoard);
                setScore((prev) => prev + result.score);

                if (isGameOver(newBoard)) {
                    setGameOver(true);
                }
            }
        },
        [board, gameOver, moveLeft, moveRight, moveUp, moveDown, addRandomTile, isGameOver]
    );

    const initGame = useCallback(() => {
        let newBoard = Array(4)
            .fill(null)
            .map(() => Array(4).fill(0));
        newBoard = addRandomTile(newBoard);
        newBoard = addRandomTile(newBoard);
        setBoard(newBoard);
        setScore(0);
        setGameOver(false);
        setGameWon(false);
    }, [addRandomTile]);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (gameOver) return;

            switch (e.key) {
                case "ArrowLeft":
                    e.preventDefault();
                    handleMove("left");
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    handleMove("right");
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    handleMove("up");
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    handleMove("down");
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [handleMove, gameOver]);

    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        setTouchStart({ x: touch.clientX, y: touch.clientY });
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStart) return;

        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStart.x;
        const deltaY = touch.clientY - touchStart.y;
        const minSwipeDistance = 50;

        if (Math.abs(deltaX) > minSwipeDistance || Math.abs(deltaY) > minSwipeDistance) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                handleMove(deltaX > 0 ? "right" : "left");
            } else {
                handleMove(deltaY > 0 ? "down" : "up");
            }
        }

        setTouchStart(null);
    };

    useEffect(() => {
        initGame();
    }, [initGame]);

    return (
        <div className="relative w-full max-w-md mx-auto p-4 bg-white dark:bg-gray-900 rounded-lg">
            <div className="flex gap-2 mb-4">
                <Button size="sm" variant="outline" onClick={() => setShowInstructions(true)}>
                    <HelpCircle className="w-4 h-4" />
                </Button>
                {onClose && (
                    <Button size="sm" variant="ghost" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                )}
                <Card className="flex-1">
                    <CardContent className="p-2 text-center">
                        <div className="text-xs text-muted-foreground">Điểm</div>
                        <div className="text-lg font-bold">{score}</div>
                    </CardContent>
                </Card>
                <Card className="flex-1">
                    <CardContent className="p-2 text-center">
                        <div className="text-xs text-muted-foreground">Cao nhất</div>
                        <div className="text-lg font-bold">{bestScore}</div>
                    </CardContent>
                </Card>
                <Button size="sm" onClick={initGame} className="py-2 px-3 h-full dark:text-white">
                    <RotateCcw className="w-4 h-4" />
                </Button>
            </div>

            <div className="grid grid-cols-4 gap-2 bg-gray-200 dark:bg-gray-700 p-2 rounded-lg mb-4" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                {board.flat().map((value, index) => (
                    <div
                        key={index}
                        className={`
                            h-16 w-16 flex items-center justify-center rounded-md font-bold text-sm border-2 transition-all duration-200
                            ${value === 0 ? "bg-gray-100 dark:bg-gray-600 border-gray-200 dark:border-gray-500" : getTileColor(value)}
                        `}>
                        {value !== 0 && <span className={value >= 1000 ? "text-xs" : "text-sm"}>{value}</span>}
                    </div>
                ))}
            </div>

            {gameWon && (
                <div className="text-center mb-4">
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        <Trophy className="w-4 h-4 mr-1" />
                        Chúc mừng! Bạn đã thắng!
                    </Badge>
                </div>
            )}

            {gameOver && (
                <div className="text-center mb-4">
                    <Badge variant="destructive" className="mb-2">
                        Game Over!
                    </Badge>
                    <div>
                        <Button onClick={initGame} size="sm">
                            Chơi lại
                        </Button>
                    </div>
                </div>
            )}

            {showInstructions && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 rounded-lg">
                    <Card className="w-full max-w-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-bold">Cách chơi 2048</h3>
                                <Button size="sm" variant="ghost" onClick={() => setShowInstructions(false)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="font-medium mb-1 inline-flex items-center gap-2">
                                        <Target size={18} />
                                        Mục tiêu:
                                    </p>
                                    <p className="text-white/60">Tạo ô có số 2048 bằng cách gộp các ô có cùng số</p>
                                </div>

                                <div>
                                    <p className="font-medium mb-1  inline-flex items-center gap-2">
                                        <SlidersHorizontal size={18} />
                                        Điều khiển:
                                    </p>
                                    <p className="text-white/60">
                                        <strong>Máy tính:</strong> Dùng phím mũi tên ←↑→↓
                                    </p>
                                    <p className="text-white/60">
                                        <strong>Điện thoại:</strong> Vuốt lên, xuống, trái, phải
                                    </p>
                                </div>

                                <div>
                                    <p className="font-medium mb-1  inline-flex items-center gap-2">
                                        <Scale size={18} /> Luật chơi:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 text-xs text-white/60">
                                        <li>Các ô cùng số sẽ gộp lại khi chạm nhau</li>
                                        <li>Mỗi lượt có ô mới xuất hiện (2 hoặc 4)</li>
                                        <li>Game kết thúc khi không thể di chuyển</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="text-center text-xs text-muted-foreground">Vuốt để di chuyển • Dùng phím mũi tên trên PC</div>
        </div>
    );
}
