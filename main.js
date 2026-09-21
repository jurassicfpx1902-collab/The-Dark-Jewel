window.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "=== THE DARK JEWEL ==="
        );

        console.log(
            "[MAIN] Inicializando sistemas..."
        );

        if (typeof AudioSystem !== "undefined") {
            console.log("[OK] AudioSystem");
        } else {
            console.error("[ERRO] AudioSystem");
        }

        if (typeof CollisionSystem !== "undefined") {
            console.log("[OK] CollisionSystem");
        } else {
            console.error("[ERRO] CollisionSystem");
        }

        if (typeof VisionSystem !== "undefined") {
            console.log("[OK] VisionSystem");
        } else {
            console.error("[ERRO] VisionSystem");
        }

        if (typeof Player !== "undefined") {
            console.log("[OK] Player");
        } else {
            console.error("[ERRO] Player");
        }

        if (typeof Enemy !== "undefined") {
            console.log("[OK] Enemy");
        } else {
            console.error("[ERRO] Enemy");
        }

        if (typeof MissionSystem !== "undefined") {
            console.log("[OK] MissionSystem");
        } else {
            console.error("[ERRO] MissionSystem");
        }

        if (typeof UISystem !== "undefined") {
            console.log("[OK] UISystem");
        } else {
            console.error("[ERRO] UISystem");
        }

        if (typeof Game !== "undefined") {
            console.log("[OK] Game");
        } else {
            console.error("[ERRO] Game");
        }

        console.log(
            "[MAIN] Verificação concluída."
        );
    }
);
