#!/usr/bin/env python3
"""Weight Quest — sprite sheet cutter."""

import os, re
from PIL import Image, ImageDraw

IMG_PATH   = "spritesheet.png"
OUT_DIR    = "icons"
DEBUG_PATH = "debug_grid.png"
JS_PATH    = "frontend/src/lib/artifacts.js"

# Точні межі колонок (x_start, x_end) — виміряно автоматично
COL_RANGES = [
    (36,  100),  # 0
    (122, 190),  # 1
    (206, 279),  # 2
    (294, 367),  # 3
    (382, 454),  # 4
    (473, 548),  # 5
    (562, 643),  # 6
    (660, 734),  # 7
    (756, 817),  # 8
    (839, 908),  # 9
    (925, 994),  # 10
    (1014,1080), # 11
    (1097,1169), # 12
]

# Секції: (y_start_row1, y_end_row1, y_start_row2, y_end_row2)
SECTION_ROWS = {
    "common":    (40,  110, 115, 185),
    "uncommon":  (220, 285, 297, 360),
    "rare":      (386, 458, 459, 533),
    "epic":      (557, 630, 631, 706),
    "legendary": (712, 795, 796, 879),
}

ARTIFACT_IDS = {
    "common": [
        "old_dumbbell","protein_bar_fake","motivation_post","gym_selfie",
        "skuf_belly","dirty_underpants","mamas_towel","neighbour_bychok",
        "shaurma_bag","dead_phone","borscht_bucket","cat_meme",
        "kovbasa_sandwich","ozon_dumbbell","straw_hat","expired_kefir",
        "lays_chips","grandma_tights","broken_scale","diet_cola",
    ],
    "uncommon": [
        "adidas_shoes","cossack_thermos","premium_buckwheat","yoga_mat",
        "grandma_slipper","salo_first_grade","water_bottle_2l","sport_leggings",
        "protein_shaker","jump_rope","morning_alarm","office_slippers",
        "homemade_mead","scooter","vyshyvanka","fathers_belt",
        "salmon_piece","garden_shovel","bike","coffee_thermos",
    ],
    "rare": [
        "lviv_beer","magic_burger","lucky_scales","uncle_bob_advice",
        "gigachad_aura","shevchenko_icon","sport_medal","gym_ticket",
        "zero_soda","buckwheat_diet","calorie_notebook","sauna_pass",
        "finish_tape","healthy_recipe","body_tape","olive_oil",
        "motivation_kit","protein_powder","running_watch","hiking_boots",
    ],
    "epic": [
        "cheat_ring","schwarzenegger_ghost","weight_joystick","shaurma_vip",
        "cossack_pipe","zaluzhnyi_cap","ufo_over_ukraine","gold_headphones",
        "marathon_trophy","magic_scales_2","dietologist_cert","balcony_bar",
        "smaller_pants","magic_wand","willpower_cup","thermonuclear_coffee",
        "borsetka","dragon_kimono","fish_tank","diet_drop_epic",
    ],
    "legendary": [
        "cossack_kettlebell","anti_burger_sword","pandora_box","gigachad_aura_max",
        "zsu_tractor","zaporizhian_trousers","hetman_mace","mazepas_hat",
        "dnipro_water","cossack_mustang","fate_finger","heavenly_trident",
        "crown_of_slim","cossack_cross","taras_sword","iron_helmet",
        "hetman_scepter","cossack_bandura","magic_borsch","cossack_eagle",
    ],
}


def get_rect(rarity: str, idx: int):
    col = idx % 13
    row = idx // 13   # 0 = перший рядок секції, 1 = другий
    x0, x1 = COL_RANGES[col]
    y0r1, y1r1, y0r2, y1r2 = SECTION_ROWS[rarity]
    if row == 0:
        return (x0, y0r1, x1, y1r1)
    else:
        return (x0, y0r2, x1, y1r2)


def cut_icons():
    os.makedirs(OUT_DIR, exist_ok=True)
    img = Image.open(IMG_PATH).convert("RGBA")
    saved = 0
    for rarity, ids in ARTIFACT_IDS.items():
        for i, aid in enumerate(ids):
            rect = get_rect(rarity, i)
            icon = img.crop(rect)
            icon.save(os.path.join(OUT_DIR, f"{aid}.png"))
            saved += 1
    print(f"✓ {saved} іконок збережено → ./{OUT_DIR}/")

    # Debug overlay
    dbg = img.copy().convert("RGB")
    d = ImageDraw.Draw(dbg)
    colors = dict(common=(150,150,150), uncommon=(80,200,80),
                  rare=(80,130,255), epic=(180,80,255), legendary=(255,200,0))
    for rarity, ids in ARTIFACT_IDS.items():
        color = colors[rarity]
        for i, aid in enumerate(ids):
            rect = get_rect(rarity, i)
            d.rectangle(list(rect), outline=color, width=2)
            d.text((rect[0]+2, rect[1]+2), str(i+1), fill=(255,255,0))
    dbg.save(DEBUG_PATH)
    print(f"✓ Debug-сітка → {DEBUG_PATH}")


def update_artifacts_js():
    with open(JS_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    all_ids = [aid for ids in ARTIFACT_IDS.values() for aid in ids]
    replaced = 0
    for aid in all_ids:
        pattern = rf"(id:\s*['\"]){re.escape(aid)}(['\"][^}}]{{0,300}}?icon:\s*)['\"][^'\"]*['\"]"
        new_content, n = re.subn(pattern, rf"\g<1>{aid}\g<2>'/icons/{aid}.png'",
                                 content, flags=re.DOTALL)
        if n:
            content = new_content
            replaced += 1

    with open(JS_PATH, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✓ artifacts.js: {replaced}/{len(all_ids)} іконок оновлено")


if __name__ == "__main__":
    import sys
    if "--update-js" in sys.argv:
        update_artifacts_js()
    else:
        cut_icons()
