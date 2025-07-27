"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { RotateCcw, Trophy, HelpCircle, X, Target, Scale } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"

interface Tile {
    id: string
    value: number
    row: number
    col: number
    isNew?: boolean
    merged?: boolean
    mergedFrom?: string[]
    previousRow?: number
    previousCol?: number
}

interface Game2048Props {
    onClose?: () => void
}

export function Game2048Smooth({ onClose }: Game2048Props) {
    const [tiles, setTiles] = useState<Tile[]>([])
    const [score, setScore] = useState(0)
    const [bestScore, setBestScore] = useState(0)
    const [gameOver, setGameOver] = useState(false)
    const [gameWon, setGameWon] = useState(false)
    const [showInstructions, setShowInstructions] = useState(false)
    const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
    const [animating, setAnimating] = useState(false)

    // Load best score from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("2048-best-score")
        if (saved) setBestScore(parseInt(saved))
    }, [])

    // Save best score
    useEffect(() => {
        if (score > bestScore) {
            setBestScore(score)
            localStorage.setItem("2048-best-score", score.toString())
        }
    }, [score, bestScore]) // Helper functions
    const generateId = useCallback(() => Math.random().toString(36).substr(2, 9), [])

    const createTile = useCallback(
        (row: number, col: number, value: number, isNew = false): Tile => ({
            id: generateId(),
            value,
            row,
            col,
            isNew,
        }),
        [generateId]
    ) // Initialize game
    const initGame = useCallback(() => {
        const initialTiles: Tile[] = []

        // Add first tile
        const firstRow = Math.floor(Math.random() * 4)
        const firstCol = Math.floor(Math.random() * 4)
        initialTiles.push(createTile(firstRow, firstCol, 2, true))

        // Add second tile
        let secondRow, secondCol
        do {
            secondRow = Math.floor(Math.random() * 4)
            secondCol = Math.floor(Math.random() * 4)
        } while (secondRow === firstRow && secondCol === firstCol)

        initialTiles.push(createTile(secondRow, secondCol, Math.random() < 0.9 ? 2 : 4, true))

        setTiles(initialTiles)
        setScore(0)
        setGameOver(false)
        setGameWon(false)
    }, [createTile]) // Add random tile
    const addRandomTile = useCallback(
        (currentTiles: Tile[]): Tile[] => {
            const occupiedPositions = new Set(currentTiles.map((tile) => `${tile.row}-${tile.col}`))
            const emptyCells: Array<[number, number]> = []

            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 4; c++) {
                    if (!occupiedPositions.has(`${r}-${c}`)) {
                        emptyCells.push([r, c])
                    }
                }
            }

            if (emptyCells.length > 0) {
                const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)]
                const newValue = Math.random() < 0.9 ? 2 : 4
                const newTile = createTile(row, col, newValue, true)
                return [...currentTiles, newTile]
            }
            return currentTiles
        },
        [createTile]
    ) // Check if game is over
    const isGameOver = useCallback((currentTiles: Tile[]) => {
        const occupiedPositions = new Set(currentTiles.map((tile) => `${tile.row}-${tile.col}`))

        // Check for empty cells
        if (occupiedPositions.size < 16) return false

        // Check for possible merges
        const grid: (number | null)[][] = Array(4)
            .fill(null)
            .map(() => Array(4).fill(null))
        currentTiles.forEach((tile) => {
            grid[tile.row][tile.col] = tile.value
        })

        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const current = grid[r][c]
                if (current === null) return false

                // Check adjacent cells
                if ((r < 3 && grid[r + 1][c] === current) || (c < 3 && grid[r][c + 1] === current)) {
                    return false
                }
            }
        }

        return true
    }, [])

    // Move tiles with animation
    const moveTiles = useCallback(
        (direction: "left" | "right" | "up" | "down") => {
            if (animating || gameOver) return

            setAnimating(true)

            const newTiles: Tile[] = []
            const merged = new Set<string>()
            let scoreIncrease = 0
            let hasMoved = false

            // Create a grid to track movements
            const grid: (Tile | null)[][] = Array(4)
                .fill(null)
                .map(() => Array(4).fill(null))
            tiles.forEach((tile) => {
                grid[tile.row][tile.col] = tile
            })

            // Move logic for each direction
            if (direction === "left") {
                for (let r = 0; r < 4; r++) {
                    const row = []
                    for (let c = 0; c < 4; c++) {
                        if (grid[r][c]) row.push(grid[r][c])
                    }

                    let newC = 0
                    for (let i = 0; i < row.length; i++) {
                        const tile = row[i]!
                        const newTile = { ...tile, previousRow: tile.row, previousCol: tile.col }

                        if (i < row.length - 1 && row[i]!.value === row[i + 1]!.value && !merged.has(row[i]!.id) && !merged.has(row[i + 1]!.id)) {
                            // Merge tiles
                            newTile.value *= 2
                            newTile.col = newC
                            newTile.merged = true
                            newTile.mergedFrom = [row[i]!.id, row[i + 1]!.id]
                            merged.add(row[i]!.id)
                            merged.add(row[i + 1]!.id)
                            scoreIncrease += newTile.value

                            if (newTile.value === 2048 && !gameWon) {
                                setGameWon(true)
                            }

                            newTiles.push(newTile)
                            i++ // Skip next tile as it's merged
                            newC++
                        } else {
                            // Move tile
                            newTile.col = newC
                            newTiles.push(newTile)
                            newC++
                        }

                        if (tile.row !== newTile.row || tile.col !== newTile.col) {
                            hasMoved = true
                        }
                    }
                }
            } else if (direction === "right") {
                for (let r = 0; r < 4; r++) {
                    const row = []
                    for (let c = 3; c >= 0; c--) {
                        if (grid[r][c]) row.push(grid[r][c])
                    }

                    let newC = 3
                    for (let i = 0; i < row.length; i++) {
                        const tile = row[i]!
                        const newTile = { ...tile, previousRow: tile.row, previousCol: tile.col }

                        if (i < row.length - 1 && row[i]!.value === row[i + 1]!.value && !merged.has(row[i]!.id) && !merged.has(row[i + 1]!.id)) {
                            newTile.value *= 2
                            newTile.col = newC
                            newTile.merged = true
                            newTile.mergedFrom = [row[i]!.id, row[i + 1]!.id]
                            merged.add(row[i]!.id)
                            merged.add(row[i + 1]!.id)
                            scoreIncrease += newTile.value

                            if (newTile.value === 2048 && !gameWon) {
                                setGameWon(true)
                            }

                            newTiles.push(newTile)
                            i++
                            newC--
                        } else {
                            newTile.col = newC
                            newTiles.push(newTile)
                            newC--
                        }

                        if (tile.row !== newTile.row || tile.col !== newTile.col) {
                            hasMoved = true
                        }
                    }
                }
            } else if (direction === "up") {
                for (let c = 0; c < 4; c++) {
                    const col = []
                    for (let r = 0; r < 4; r++) {
                        if (grid[r][c]) col.push(grid[r][c])
                    }

                    let newR = 0
                    for (let i = 0; i < col.length; i++) {
                        const tile = col[i]!
                        const newTile = { ...tile, previousRow: tile.row, previousCol: tile.col }

                        if (i < col.length - 1 && col[i]!.value === col[i + 1]!.value && !merged.has(col[i]!.id) && !merged.has(col[i + 1]!.id)) {
                            newTile.value *= 2
                            newTile.row = newR
                            newTile.merged = true
                            newTile.mergedFrom = [col[i]!.id, col[i + 1]!.id]
                            merged.add(col[i]!.id)
                            merged.add(col[i + 1]!.id)
                            scoreIncrease += newTile.value

                            if (newTile.value === 2048 && !gameWon) {
                                setGameWon(true)
                            }

                            newTiles.push(newTile)
                            i++
                            newR++
                        } else {
                            newTile.row = newR
                            newTiles.push(newTile)
                            newR++
                        }

                        if (tile.row !== newTile.row || tile.col !== newTile.col) {
                            hasMoved = true
                        }
                    }
                }
            } else if (direction === "down") {
                for (let c = 0; c < 4; c++) {
                    const col = []
                    for (let r = 3; r >= 0; r--) {
                        if (grid[r][c]) col.push(grid[r][c])
                    }

                    let newR = 3
                    for (let i = 0; i < col.length; i++) {
                        const tile = col[i]!
                        const newTile = { ...tile, previousRow: tile.row, previousCol: tile.col }

                        if (i < col.length - 1 && col[i]!.value === col[i + 1]!.value && !merged.has(col[i]!.id) && !merged.has(col[i + 1]!.id)) {
                            newTile.value *= 2
                            newTile.row = newR
                            newTile.merged = true
                            newTile.mergedFrom = [col[i]!.id, col[i + 1]!.id]
                            merged.add(col[i]!.id)
                            merged.add(col[i + 1]!.id)
                            scoreIncrease += newTile.value

                            if (newTile.value === 2048 && !gameWon) {
                                setGameWon(true)
                            }

                            newTiles.push(newTile)
                            i++
                            newR--
                        } else {
                            newTile.row = newR
                            newTiles.push(newTile)
                            newR--
                        }

                        if (tile.row !== newTile.row || tile.col !== newTile.col) {
                            hasMoved = true
                        }
                    }
                }
            }

            if (hasMoved) {
                setTiles(newTiles)
                setScore((prev) => prev + scoreIncrease)

                // Add new tile after animation
                setTimeout(() => {
                    setTiles((prevTiles) => {
                        const tilesWithNewTile = addRandomTile(
                            prevTiles.map((tile) => ({
                                ...tile,
                                isNew: false,
                                merged: false,
                                previousRow: undefined,
                                previousCol: undefined,
                            }))
                        )

                        // Check game over
                        if (isGameOver(tilesWithNewTile)) {
                            setGameOver(true)
                        }

                        return tilesWithNewTile
                    })
                    setAnimating(false)
                }, 200)
            } else {
                setAnimating(false)
            }
        },
        [tiles, animating, gameOver, gameWon, addRandomTile, isGameOver]
    )

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameOver || animating) return

            switch (e.key) {
                case "ArrowLeft":
                    e.preventDefault()
                    moveTiles("left")
                    break
                case "ArrowRight":
                    e.preventDefault()
                    moveTiles("right")
                    break
                case "ArrowUp":
                    e.preventDefault()
                    moveTiles("up")
                    break
                case "ArrowDown":
                    e.preventDefault()
                    moveTiles("down")
                    break
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [moveTiles, gameOver, animating])

    // Touch and Mouse controls
    const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    // Touch controls (mobile)
    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0]
        setDragStart({ x: touch.clientX, y: touch.clientY })
        setIsDragging(true)
    }

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!dragStart || !isDragging) return

        const touch = e.changedTouches[0]
        const deltaX = touch.clientX - dragStart.x
        const deltaY = touch.clientY - dragStart.y
        const minSwipeDistance = 50

        if (Math.abs(deltaX) > minSwipeDistance || Math.abs(deltaY) > minSwipeDistance) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                moveTiles(deltaX > 0 ? "right" : "left")
            } else {
                moveTiles(deltaY > 0 ? "down" : "up")
            }
        }

        setDragStart(null)
        setIsDragging(false)
    }

    // Mouse controls (PC)
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault()
        setDragStart({ x: e.clientX, y: e.clientY })
        setIsDragging(true)
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !dragStart) return
        e.preventDefault()
    }

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!dragStart || !isDragging) return

        const deltaX = e.clientX - dragStart.x
        const deltaY = e.clientY - dragStart.y
        const minSwipeDistance = 30 // Nhỏ hơn cho chuột vì chính xác hơn

        if (Math.abs(deltaX) > minSwipeDistance || Math.abs(deltaY) > minSwipeDistance) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                moveTiles(deltaX > 0 ? "right" : "left")
            } else {
                moveTiles(deltaY > 0 ? "down" : "up")
            }
        }

        setDragStart(null)
        setIsDragging(false)
    }

    const handleMouseLeave = () => {
        // Reset dragging when mouse leaves the game area
        setDragStart(null)
        setIsDragging(false)
    }

    // Initialize game on mount
    useEffect(() => {
        initGame()
    }, [initGame])

    // Reset game
    const resetGame = () => {
        initGame()
    }

    // Get tile color
    const getTileColor = (value: number) => {
        const colors: { [key: number]: string } = {
            2: "bg-yellow-100 text-yellow-800",
            4: "bg-yellow-200 text-yellow-900",
            8: "bg-orange-200 text-orange-900",
            16: "bg-orange-300 text-orange-900",
            32: "bg-orange-400 text-white",
            64: "bg-red-400 text-white",
            128: "bg-red-500 text-white",
            256: "bg-red-600 text-white",
            512: "bg-purple-500 text-white",
            1024: "bg-purple-600 text-white",
            2048: "bg-purple-700 text-white",
        }
        return colors[value] || "bg-purple-800 text-white"
    }

    // Get tile size class
    const getTileSize = (value: number) => {
        if (value >= 1000) return "text-xs"
        if (value >= 100) return "text-sm"
        return "text-base"
    }

    return (
        <div className="flex flex-col items-center justify-center md:bg-slate-800/50 rounded-md md:rounded-3xl dark:border-white/10 border-2 border-transparent md:p-4">
            <style jsx>{`
                .tile {
                    position: absolute;
                    width: calc(25% - 8px);
                    height: calc(25% - 8px);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    transition: all 0.2s ease-in-out;
                    z-index: 1;
                }

                .tile.new {
                    animation: tileAppear 0.2s ease-in-out;
                }

                .tile.merged {
                    animation: tileMerge 0.2s ease-in-out;
                }

                @keyframes tileAppear {
                    0% {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes tileMerge {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.1);
                    }
                    100% {
                        transform: scale(1);
                    }
                }

                .game-grid {
                    position: relative;
                    width: 280px;
                    height: 280px;
                    background: #bbada0;
                    border-radius: 12px;
                    padding: 8px;
                    gap: 8px;
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    grid-template-rows: repeat(4, 1fr);
                }

                .grid-cell {
                    background: #cdc1b4;
                    border-radius: 6px;
                }

                @media (max-width: 640px) {
                    .game-grid {
                        width: 250px;
                        height: 250px;
                    }
                }
            `}</style>

            <Card className="max-w-xs sm:max-w-lg mx-auto border-0 md:border md:border-4 border-transparent dark:border-white/10">
                <CardContent className="p-1 md:p-6">
                    {/* Score */}
                    <div className="flex justify-between mb-4">
                        <Badge variant="secondary" className="text-sm">
                            <Trophy className="w-4 h-4 mr-1" />
                            Điểm: {score}
                        </Badge>
                        <Dialog>
                            <DialogTrigger>
                                {" "}
                                <Button variant="ghost" size="sm" onClick={() => setShowInstructions(!showInstructions)}>
                                    <HelpCircle className="w-4 h-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-xs sm:max-w-lg">
                                <div className="mb-4 p-4 dark:text-blue-300  rounded-lg text-sm">
                                    <p className="font-semibold mb-2">Cách chơi:</p>
                                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-white/80">
                                        <li>Vuốt để di chuyển các ô</li>
                                        <li>Sử dụng phím mũi tên hoặc kéo chuột để di chuyển</li>
                                    </ul>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Badge variant="outline" className="text-sm">
                            <Scale className="w-4 h-4 mr-1" />
                            Cao nhất: {bestScore}
                        </Badge>
                    </div>

                    {/* Game Grid */}
                    <div className="flex justify-center mb-4">
                        <div
                            className="game-grid"
                            style={{
                                cursor: isDragging ? "grabbing" : "grab",
                                userSelect: "none", // Prevent text selection while dragging
                            }}
                            // Touch events (mobile)
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                            // Mouse events (PC)
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseLeave}
                        >
                            {/* Grid cells */}
                            {Array.from({ length: 16 }, (_, i) => (
                                <div key={i} className="grid-cell" />
                            ))}

                            {/* Tiles */}
                            {tiles.map((tile) => (
                                <div
                                    key={tile.id}
                                    className={`tile ${tile.isNew ? "new" : ""} ${tile.merged ? "merged" : ""} ${getTileColor(tile.value)} ${getTileSize(tile.value)}`}
                                    style={{
                                        left: `${tile.col * 25 + 2}%`,
                                        top: `${tile.row * 25 + 2}%`,
                                        pointerEvents: "none", // Prevent tiles from interfering with drag
                                    }}
                                >
                                    {tile.value}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Game Status */}
                    {gameWon && !gameOver && (
                        <div className="text-center mb-4">
                            <Badge className="bg-green-500 text-white">🎉 Chúc mừng! Bạn đã đạt 2048!</Badge>
                        </div>
                    )}

                    {gameOver && (
                        <div className="text-center mb-4">
                            <Badge variant="destructive">💀 Game Over! Điểm: {score}</Badge>
                        </div>
                    )}

                    {/* Controls */}
                    <div className="flex justify-center">
                        <Button onClick={resetGame} className="bg-purple-600 hover:bg-purple-700 text-white" disabled={animating}>
                            <RotateCcw className="w-4 h-4" />
                            Chơi lại
                        </Button>
                    </div>

                    {/* Mobile Controls Help */}
                    <div className="mt-4 text-center text-xs text-gray-500 sm:hidden">Vuốt để di chuyển các ô</div>
                </CardContent>
            </Card>
        </div>
    )
}
