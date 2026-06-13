# Simulation Report: tb001-page5-power-boundary-fds6574-bank

## Purpose
Alternate TB001 page-5/page-4 boundary model: the page-4-derived control signal still drives a DMN-class NMOS gate pull-down, but the unresolved FDS6574 family is treated as a stronger composite PMOS pass bank rather than a single pass element.

## Circuit Summary
* Title: tb001-page5-power-boundary-fds6574-bank
* Components: 11
* Analyses: tran
* Outputs: v(VIN), v(EN), v(PGATE), v(VOUT)

## Assumptions
* This case keeps the same control-side abstraction as the baseline page-5 case so the main comparison is in the interpretation of the FDS6574 family.
* FDS6574 is treated here as a stronger composite PMOS pass bank rather than a single PMOS element.
* DMN5L06DMK-AB is still treated as an NMOS gate-pull device controlled from the page-4 boundary.
* The upstream source is modeled as a 1.8 V rail with small source impedance and local bulk capacitance.
* The downstream load still stands in for one representative UUT-facing branch with connector and local capacitance lumped together.
* This is not a claim of exact device count or exact pin mapping; it is a comparison hypothesis for whether the unresolved FDS6574 family behaves more like a stronger switched bank than a single weak pass element.

## SVG Intake
* Source: /home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/examples/pcb/cases/tb001-page5-power-boundary-fds6574-bank/input/source.svg
* Text labels extracted: 0
* Primitive counts: line=0, polyline=0, path=2101, rect=0, circle=0, text=0

## Generated Artifacts
* Deck: /home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/examples/pcb/cases/tb001-page5-power-boundary-fds6574-bank/artifacts/circuit.cir
* Run log: /home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/examples/pcb/cases/tb001-page5-power-boundary-fds6574-bank/outputs/run.log
* Deck contains default models: yes

## Run Status
```text
613	1.164466e-02	1.426728e+00	
614	1.166466e-02	1.426729e+00	
615	1.168466e-02	1.426729e+00	
616	1.170466e-02	1.426729e+00	
617	1.172466e-02	1.426730e+00	
618	1.174466e-02	1.426730e+00	
619	1.176466e-02	1.426730e+00	
620	1.178466e-02	1.426731e+00	
621	1.180466e-02	1.426731e+00	
622	1.182466e-02	1.426731e+00	
623	1.184466e-02	1.426731e+00	
624	1.186466e-02	1.426731e+00	
625	1.188466e-02	1.426732e+00	
626	1.190466e-02	1.426732e+00	
627	1.192466e-02	1.426732e+00	
628	1.194466e-02	1.426732e+00	
629	1.196466e-02	1.426732e+00	
630	1.198466e-02	1.426732e+00	
631	1.200000e-02	1.426732e+00	
ngspice-44.2 done
```

## Next Checks
* Replace generic models with vendor or justified project models where they affect decisions.
* Tighten loads, initial conditions, and rail assumptions using corpus evidence.
* Feed any observed failures or sensitivities back into the engineering artifacts.
