# Simulation Report: tb001-page5-power-boundary

## Purpose
First-pass TB001 page-5/page-4 boundary model: a page-4-derived control signal drives a DMN-class NMOS that pulls down the gate of an FDS6574-class PMOS high-side switch feeding one representative V1P8 UUT branch.

## Circuit Summary
* Title: tb001-page5-power-boundary
* Components: 10
* Analyses: tran
* Outputs: v(VIN), v(EN), v(PGATE), v(VOUT)

## Assumptions
* This case models one representative switched V1P8 output branch rather than the full page-5 connector and transistor bank.
* FDS6574 is treated as a PMOS high-side pass element for the branch under test.
* DMN5L06DMK-AB is treated as an NMOS gate-pull device controlled from the page-4 control boundary.
* The upstream source is modeled as a 1.8 V rail with small source impedance and local bulk capacitance.
* The downstream load stands in for one UUT-facing branch such as V1P8-Core/UUT or V1P8-IO/UUT with connector and local capacitance lumped together.
* J18/J19 are treated as representative outward-facing load boundary candidates, but exact connector-to-rail mapping remains unresolved.
* This deck is for startup and gating behavior only; it is not yet a validated representation of final device sizing or exact pin mapping.

## SVG Intake
* Source: /home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/examples/pcb/cases/tb001-page5-power-boundary/input/source.svg
* Text labels extracted: 0
* Primitive counts: line=0, polyline=0, path=2101, rect=0, circle=0, text=0

## Generated Artifacts
* Deck: /home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/examples/pcb/cases/tb001-page5-power-boundary/artifacts/circuit.cir
* Run log: /home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/examples/pcb/cases/tb001-page5-power-boundary/outputs/run.log
* Deck contains default models: yes

## Run Status
```text
613	1.164863e-02	1.098388e+00	
614	1.166863e-02	1.098585e+00	
615	1.168863e-02	1.098772e+00	
616	1.170863e-02	1.098951e+00	
617	1.172863e-02	1.099121e+00	
618	1.174863e-02	1.099284e+00	
619	1.176863e-02	1.099439e+00	
620	1.178863e-02	1.099586e+00	
621	1.180863e-02	1.099727e+00	
622	1.182863e-02	1.099862e+00	
623	1.184863e-02	1.099990e+00	
624	1.186863e-02	1.100112e+00	
625	1.188863e-02	1.100229e+00	
626	1.190863e-02	1.100340e+00	
627	1.192863e-02	1.100446e+00	
628	1.194863e-02	1.100547e+00	
629	1.196863e-02	1.100644e+00	
630	1.198863e-02	1.100736e+00	
631	1.200000e-02	1.100786e+00	
ngspice-44.2 done
```

## Next Checks
* Replace generic models with vendor or justified project models where they affect decisions.
* Tighten loads, initial conditions, and rail assumptions using corpus evidence.
* Feed any observed failures or sensitivities back into the engineering artifacts.
