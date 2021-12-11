HOLOCORE Roadshow
=================

This repository implements RAN state viewer for HOLOCORE demonstration.

![](./screenshot_v1.3.7.png)

### Features

- Locate UEs and cells on the map
- Display UE mobility routes
- Show UE/cell state using icon colors
- Hover on cell to see its load
- Hover on UE to see its radio measurement
- Click cell to show associated UEs
- Click UE to show available cells
- Simplify cell name
- Light/dark mode

### Requirements

- Node.js `>=v16.0.0`
- Yarn `>=1.22.0`

### Usage

```bash
$ yarn
$ NEXT_PUBLIC_API_ENDPOINT="hakos.holocore.space:3324" yarn dev
```

Then browse below pages:
- `http://localhost:3000/`
- `http://localhost:3000/dispLatLng?points=36.014230,129.331049!36.014625,129.331828`

Note that the black/white maps are only available in localhost(127.0.0.1) domain.

### Configuration

You can configure below environment variables to this program.

- `NEXT_PUBLIC_UPDATE_INTERVAL` : Data update interval in miliseconds. (default: `1000` = 1 seconds)
- `NEXT_PUBLIC_API_ENDPOINT` : Roadshow endpoint. (ex: `127.0.0.1:3324`)
- `NEXT_PUBLIC_API_TYPE` : RAN connection type. (`SDRAN` (default) or `RAN2`) \
    <sup>Note: currrently only SDRAN is supported.</sup>
- `NEXT_PUBLIC_UE_STATELEVEL` : UE state coloring criteria in dBm of 4. (ex/default: `"-106,-116,-126,-156"`)
    🎨 very good : blue // good : green // not bad : yellow // bad : red
- `NEXT_PUBLIC_CELL_LOADLEVEL` : Cell load coloring criteria of 4. (ex/default: `"1.,0.95,0.75,0.0"`)
    🎨 exploded : pink // full : red // high load : orange // load exists : yellow // no load : green
- `NEXT_PUBLIC_ALWAYS_SHOW_UE_TOOLTIP` : Do you want to see UE tooltip always? (`true` or `false`(default))
- `NEXT_PUBLIC_USE_ARROWLINE` : Set this `true` or `false` to show or hide arrowline on UE route. (`true` or `false` or `only-end`(default))
- `NEXT_PUBLIC_SHOW_SINR_CQI` : Set this `true` if you want to see simulated SINR/CQI value (`true` or `false`(default))
- `NEXT_PUBLIC_SHOW_RAW_NCGI` : Shows raw NCGI instead of simple name. (`true` or `false`(default))
- `NEXT_PUBLIC_WANNA_FLY` : Do you want to fly? (`true` (default) or `false`)
- `NEXT_PUBLIC_HO_LOGICS` : HO logic strings to be used (ex/default: `local,holocore`)

Example environment files can be found on [`.env.example`](/.env.example).

&copy; Jio Gim.
