"use strict";

const NavigationSystem={

    cellSize:20,

    width:40,

    height:30,

    blockedGrid:[],

    build(objects){

        this.blockedGrid=
            Array.from(
                {length:this.height},
                ()=>Array(this.width).fill(false)
            );

        for(let y=0;y<this.height;y++){

            for(let x=0;x<this.width;x++){

                const cell={
                    x:x*this.cellSize,
                    y:y*this.cellSize,
                    w:this.cellSize,
                    h:this.cellSize
                };

                if(
                    CollisionSystem.blocked(
                        cell,
                        objects
                    )
                ){

                    this.blockedGrid[y][x]=true;
                }
            }
        }
    },

    cellFromPoint(point){

        return{
            x:Math.max(
                0,
                Math.min(
                    this.width-1,
                    Math.floor(
                        point.x/this.cellSize
                    )
                )
            ),

            y:Math.max(
                0,
                Math.min(
                    this.height-1,
                    Math.floor(
                        point.y/this.cellSize
                    )
                )
            );
    },

    cellKey(x,y){
        return `${x},${y}`;
    },

    walkable(x,y){

        if(
            x<0||
            y<0||
            x>=this.width||
            y>=this.height
        ){
            return false;
        }

        return !this.blockedGrid[y][x];
    },

    neighbors(node){

        const result=[];

        const dirs=[
            [1,0,1],
            [-1,0,1],
            [0,1,1],
            [0,-1,1],

            [1,1,1.414],
            [-1,1,1.414],
            [1,-1,1.414],
            [-1,-1,1.414]
        ];

        for(const d of dirs){

            const nx=node.x+d[0];
            const ny=node.y+d[1];

            if(!this.walkable(nx,ny))
                continue;

            if(
                d[0]!==0 &&
                d[1]!==0
            ){

                if(
                    !this.walkable(
                        node.x+d[0],
                        node.y
                    )||
                    !this.walkable(
                        node.x,
                        node.y+d[1]
                    )
                ){
                    continue;
                }
            }

            result.push({
                x:nx,
                y:ny,
                cost:d[2]
            });
        }

        return result;
    },

    heuristic(a,b){

        return Math.hypot(
            b.x-a.x,
            b.y-a.y
        );
    },

    findPath(startPoint,endPoint){

        const start=
            this.cellFromPoint(
                startPoint
            );

        const end=
            this.cellFromPoint(
                endPoint
            );

        if(
            !this.walkable(
                end.x,
                end.y
            )
        ){
            return[];
        }

        const open=[{
            x:start.x,
            y:start.y,
            g:0,
            f:this.heuristic(
                start,
                end
            ),
            parent:null
        }];

        const closed=new Set();

        const best=new Map();

        best.set(
            this.cellKey(
                start.x,
                start.y
            ),
            0
        );

        let safety=0;

        while(
            open.length &&
            safety<1200
        ){

            safety++;

            let bestIndex=0;

            for(
                let i=1;
                i<open.length;
                i++
            ){

                if(
                    open[i].f<
                    open[bestIndex].f
                ){
                    bestIndex=i;
                }
            }

            const current=
                open.splice(
                    bestIndex,
                    1
                )[0];

            const currentKey=
                this.cellKey(
                    current.x,
                    current.y
                );

            if(closed.has(currentKey))
                continue;

            closed.add(currentKey);

            if(
                current.x===end.x &&
                current.y===end.y
            ){

                const path=[];

                let node=current;

                while(node){

                    path.push({
                        x:
                            node.x*
                            this.cellSize+
                            this.cellSize/2,

                        y:
                            node.y*
                            this.cellSize+
                            this.cellSize/2
                    });

                    node=node.parent;
                }

                path.reverse();

                if(path.length>1)
                    path.shift();

                return path;
            }

            for(
                const neighbor
                of this.neighbors(current)
            ){

                const key=
                    this.cellKey(
                        neighbor.x,
                        neighbor.y
                    );

                if(closed.has(key))
                    continue;

                const newG=
                    current.g+
                    neighbor.cost;

                const previous=
                    best.get(key);

                if(
                    previous!==undefined &&
                    newG>=previous
                ){
                    continue;
                }

                best.set(
                    key,
                    newG
                );

                open.push({

                    x:neighbor.x,
                    y:neighbor.y,

                    g:newG,

                    f:
                        newG+
                        this.heuristic(
                            neighbor,
                            end
                        ),

                    parent:current
                });
            }
        }

        return[];
    }
};
