# TB001 Component Catalog Summary

This index summarizes the TB001 component records that are currently grounded in
local BOM and datasheet evidence.

## Why This Exists

The TB001 corpus now has enough component records that it is useful to have one
place that answers:

* which parts are normalized so far
* what board role each part covers
* which page-level use artifacts already exist
* what the next extraction priority should be

## Cataloged Components

| Part | Board role | Component record | Current use artifacts | Notes |
| --- | --- | --- | --- | --- |
| `FDS6574A` | page-4/page-5 switching family | `fds6574.md` | `q1-fds6574-page4.md`, `q1-q5-q7-q8-q10-q11-fds6574-page5.md` | Most important switching uncertainty; local onsemi datasheet confirms `N-channel`. |
| `DMN5L06DMK-AB` | page-4/page-5 control-side MOSFET family | `dmn5l06dmk-ab.md` | `q2-dmn5l06dmk-ab-page4.md`, `q3-q4-q6-q9-dmn5l06dmk-ab-page5.md` | Dual N-channel device already used in current switching hypotheses. |
| `MAX3218EAP` | serial/control boundary IC | `max3218eap.md` | `u6-max3218eap-page4.md` | Strong page-4 control-boundary anchor around the `DB9F` connector region. |
| `0603LS-153XJRC` | page-4 inductor `L1` | `0603ls-153xjrc.md` | `l1-0603ls-153xjrc-page4.md` | Important for later converter or filter reconstruction. |
| `CY62167EV18LL-55BVXI` | page-1 SRAM `U1` | `cy62167ev18ll-55bvxi.md` | `u1-cy62167ev18ll-55bvxi-page1.md` | High-value digital-interface and rail-domain anchor. |
| `SST25WF020` | page-1 SPI flash `U3` | `sst25wf020.md` | `u3-sst25wf020-page1.md` | `DS20005016C` is the datasheet document number, not the part number. |
| `288-4205-01` | page-2 GA144 socket `U4` | `288-4205-01.md` | `u4-288-4205-01-page2.md` | Mechanical/socket artifact, not an active IC. |

## Structure Rule

This folder intentionally separates:

* `components/tb001/*.md`: manufacturer-grounded part records
* `component-uses/tb001/*.md`: board-specific use of those parts

That is why some parts appear in more than one markdown file. One file records
what the part is; the others record where and how TB001 uses it.

## Why `FDS6574` Has More Than One Markdown File

`FDS6574` currently appears in three TB001 catalog artifacts:

* `components/tb001/fds6574.md`
* `component-uses/tb001/q1-fds6574-page4.md`
* `component-uses/tb001/q1-q5-q7-q8-q10-q11-fds6574-page5.md`

This is intentional:

* `fds6574.md` is the manufacturer-grounded component record
* `q1-fds6574-page4.md` is the page-4 use of that part family
* `q1-q5-q7-q8-q10-q11-fds6574-page5.md` is the page-5 bank use of that same
  part family

The part exists once as a component identity, but it is reused in more than one
board context.

## Next Extraction Priorities

Highest value next:

* normalize pin-level facts for `FDS6574A`
* normalize pin-level facts for `DMN5L06DMK-AB`
* capture interface-oriented pin mapping for `CY62167EV18LL-55BVXI` and
  `SST25WF020`
* promote the page-4 DB9 signal-family map into exact connector pin mapping for
  `U6`, `J1`, and `J2`
