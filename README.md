HOLOCORE Roadshow
=================

This repository implements RAN state viewer for HOLOCORE demonstration.

You can configure below environment variables to this program.

- `NEXT_PUBLIC_UPDATE_INTERVAL` : Data update interval in miliseconds. (default: `1000` = 1 seconds)
- `NEXT_PUBLIC_API_ENDPOINT` : Roadshow endpoint. (ex: `127.0.0.1:3324`)
- `NEXT_PUBLIC_API_TYPE` : RAN connection type. (`SDRAN` (default) or `RAN2`) \
    <sup>Note: currrently only SDRAN is supported.</sup>

### Requirements

- Node.js `>=v16.0.0`
- Yarn `>=1.22.0`

### Usage

```bash
$ yarn
$ NEXT_PUBLIC_API_ENDPOINT="hakos.holocore.space:3324" yarn dev
```

---

### To Do

- [ ] Set correct range factor

---

&copy; Jio Gim.
