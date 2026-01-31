import { waitWS } from "./modules/getHooks";
import { onElement } from "./modules/uiHelpers";
import { decode } from "@msgpack/msgpack";

function menuUITweaks() {
  // remover alguns elementos do menu

  [
    "#adCard",
    "wideAdCard",
    "#joinPartyButton",
    "#linksContainer2",
    "#promoImgHolder",
    "#gameName",
    "#wideAdCard",
    ".adsbygoogle"
  ].forEach(selector => {
    onElement<HTMLElement>(selector, (el) => el.remove());
  });

  onElement<HTMLElement>(".menuCard", (el) => {
    el.style.backgroundColor = "rgba(0.0, 0.0, 0.0, 0.5)";
    el.style.color = "#999";
  });

  onElement<HTMLElement>("#rightCardHolder", (el) => {
    el.style.display = "block";
  });
}

function gameUITweaks() {
  onElement<HTMLElement>("#bottomContainer", (el) => {
    el.style.bottom = "auto";
    el.style.right = "auto";
  });

  onElement<HTMLElement>("#itemInfoHolder", (el) => {
    el.style.top = "140px";
  });

  onElement<HTMLElement>("#upgradeHolder", (el) => el.style.bottom = "10px");

  onElement<HTMLElement>("#storeMenu", (el) => {
    el.style.scale = "0.8";
    el.style.borderRadius = "0px"
  });

  ["#storeHolder", ".storeTab"].forEach(selection => {
    onElement<HTMLElement>(selection, (el) => {
      el.style.backgroundColor = "rgba(0, 0, 0, 0.09)";
      el.style.borderRadius = "0px";
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.style.scrollBehavior = "auto";
  document.body.style.scrollBehavior = "auto";

  menuUITweaks();
});

(async () => {
  try {
    const ws = await waitWS();

    console.log("[WS] conectado:", ws.url);

    ws.addEventListener("message", async (e: MessageEvent) => {
      let buffer: ArrayBuffer;

      if (e.data instanceof ArrayBuffer) {
        buffer = e.data;
      } else if (e.data instanceof Blob) {
        buffer = await e.data.arrayBuffer();
      } else {
        return;
      }

      const data = decode(new Uint8Array(buffer));

      if (Array.isArray(data)) {
        const opcode = data[0];

        switch (opcode) {
          // Enter game
          case "C":
            console.log("recebi W");
            gameUITweaks();
            break;
        }
      }

      //console.log("[WS] recv:", data);
    });



  } catch (err) {
    console.error("[WS] erro:", err);
  }
})();
