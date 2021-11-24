HOLOCORE Roadshow
=================

This repository implements RAN state viewer for HOLOCORE demonstration.

![](./screenshot_v1.1.1.jpeg)

You can configure below environment variables to this program.

- `NEXT_PUBLIC_UPDATE_INTERVAL` : Data update interval in miliseconds. (default: `1000` = 1 seconds)
- `NEXT_PUBLIC_API_ENDPOINT` : Roadshow endpoint. (ex: `127.0.0.1:3324`)
- `NEXT_PUBLIC_API_TYPE` : RAN connection type. (`SDRAN` (default) or `RAN2`) \
    <sup>Note: currrently only SDRAN is supported.</sup>
- `NEXT_PUBLIC_UE_STATELEVEL` : UE state coloring criteria in dBm. (ex/default: `"-106,-116,-126,-156"`)
- `NEXT_PUBLIC_CELL_LOADLEVEL` : Cell load coloring criteria. (ex/default: `"0.95,0.75,0.0"`)
- `NEXT_PUBLIC_ALWAYS_SHOW_UE_TOOLTIP` : Do you want to see UE tooltip always? (`true` or `false`(default))
- `NEXT_PUBLIC_SHOW_SINR_CQI` : Set this `true` if you want to see simulated SINR/CQI value (`true` or `false`(default))
- `NEXT_PUBLIC_SHOW_RAW_NCGI` : Shows raw NCGI instead of simple name. (`true` or `false`(default))
- `NEXT_PUBLIC_WANNA_FLY` : Do you want to fly? (`true` (default) or `false`)

Example environment files can be found on [`.env.example`](/.env.example).

### Requirements

- Node.js `>=v16.0.0`
- Yarn `>=1.22.0`

### Usage

```bash
$ yarn
$ NEXT_PUBLIC_API_ENDPOINT="hakos.holocore.space:3324" yarn dev
```

&copy; Jio Gim.
