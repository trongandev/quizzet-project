import { Badge } from '@/components/ui/badge'

import { Card, CardContent } from '@/components/ui/card'
import type { IGamification, ILevel } from '@/types/etc'
export default function LevelProfile({ gamificationProfile, levels }: { gamificationProfile: IGamification; levels: ILevel[] }) {
    return (
        <div>
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Tất cả cấp độ</h2>
                <Badge variant="secondary" className="dark:bg-slate-700">
                    {levels.length} cấp độ
                </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[500px] overflow-y-auto my-5">
                {levels.map((level, index) => {
                    const isCurrentLevel = level.level === gamificationProfile.level
                    const isUnlocked = level.level <= gamificationProfile.level

                    return (
                        <Card
                            key={index}
                            className={`dark:border-slate-700 border-2 ${
                                isCurrentLevel
                                    ? 'bg-linear-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 border-indigo-600/50 dark:border-indigo-500/50'
                                    : isUnlocked
                                    ? 'dark:bg-slate-800'
                                    : 'dark:bg-slate-800/50'
                            }`}
                        >
                            <CardContent className="p-6 text-center">
                                <div
                                    className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center  ${
                                        isUnlocked ? `bg-linear-to-br from-indigo-400 to-indigo-600` : ' bg-slate-400/50 dark:bg-slate-700'
                                    } ${isCurrentLevel ? 'ring-4 ring-indigo-500/50' : ''}`}
                                >
                                    <img src={level.levelIcon} alt="" width={40} height={40} />
                                </div>

                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <h3 className={`font-bold text-lg ${isCurrentLevel ? 'text-indigo-400' : isUnlocked ? 'text-white' : 'text-slate-400'}`}>Cấp {level.level}</h3>
                                </div>

                                <p className={`text-sm mb-1 ${isUnlocked ? 'text-indigo-800 dark:text-slate-300' : 'text-slate-500'}`}>{level.name}</p>
                                {isCurrentLevel ? (
                                    <Badge className="bg-indigo-600 text-white text-xs">Hiện tại</Badge>
                                ) : (
                                    <div className="text-xs text-slate-400">
                                        {isUnlocked ? (
                                            level.level < gamificationProfile.xp ? (
                                                <span className="text-green-400">✓ Đã mở khóa</span>
                                            ) : level.level === gamificationProfile.xp ? (
                                                <span className="text-indigo-400">Cấp độ hiện tại</span>
                                            ) : null
                                        ) : (
                                            <span>Cần {(level.xpRequired - gamificationProfile.xp).toLocaleString()} XP</span>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
