window.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "[THE DARK JEWEL] Inicializando..."
        );

        AudioSystem.init();

        UISystem.init();

        Game.init();

        console.log(
            "[THE DARK JEWEL] Todos os módulos carregados."
        );

        console.log(
            "AudioSystem:",
            !!window.AudioSystem
        );

        console.log(
            "CollisionSystem:",
            !!window.CollisionSystem
        );

        console.log(
            "VisionSystem:",
            !!window.VisionSystem
        );

        console.log(
            "Player:",
            !!window.Player
        );

        console.log(
            "Enemy:",
            !!window.Enemy
        );

        console.log(
            "MissionSystem:",
            !!window.MissionSystem
        );

        console.log(
            "UISystem:",
            !!window.UISystem
        );

        console.log(
            "Game:",
            !!window.Game
        );
    }
);
