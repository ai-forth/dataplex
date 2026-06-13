# Simulation Report: tb001-ga144-test-bringup

## Purpose
TB001 functional bring-up hypothesis: a common 1.8 V source keeps the page-1 GA144 test-master side alive while page-4/page-5 control releases three switched UUT-facing 1.8 V domains for a socketed GA144 under test.

## Circuit Summary
* Title: tb001-ga144-test-bringup
* Components: 35
* Analyses: tran
* Outputs: v(VIN_MAIN), v(VMASTER), v(VU2), v(VU1), v(VU3), v(RESET_HOLD), v(GCORE), v(GIO), v(GAN), v(VCORE), v(VIO), v(VAN), v(DISABLE)

## Assumptions
* The page-1 master side is represented as an always-on 1.8 V branch split into GA144 test-master, SRAM, and SPI flash sub-loads.
* The page-2 UUT side is represented as three switched branches: V1P8-Core/UUT, V1P8-IO/UUT, and V1P8-Analog/UUT.
* FDS6574A is treated as the stronger N-channel pass family that feeds the UUT branches from the common 1.8 V distribution.
* DMN5L06DMK-AB is treated as the smaller N-channel clamp family that holds branch gates low until control release.
* A 3.3 V control domain is available to pull the branch gates high enough to pass a 1.8 V rail through an N-channel device abstraction.
* This case follows the candidate TB001 operating sequence: master-side rail first, UUT held while control settles, UUT rails enabled, then reset effectively released after settlement.
* The delayed DISABLE pulse stands in for the combined effect of reset assertion, boot-mode selection, and later UUT branch enable rather than one exact named schematic net.
* The current run should be read as a No-Boot-or-held-in-reset style startup path; SPI-enabled behavior remains a later comparison mode rather than something digitally simulated here.
* RESET_HOLD is only a timing proxy for deferred UUT activity and not a proven reconstruction of the exact GA144 RESET- wiring.
* For this pass, about 10% modeling accuracy is acceptable if the result preserves the real operating window that matters for GA144 test use.
* GA144 operating fitness is judged primarily against its recommended VDD window of 1.62 V to 2.0 V rather than against an exact 1.800 V target.
* The test-master side should remain substantially stable while the UUT branches are enabled.
* This case is for power-up fitness and intended test usage only; it does not simulate full GA144 logic or protocol behavior.

## Generated Artifacts
* Deck: /home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/examples/pcb/cases/tb001-ga144-test-bringup/artifacts/circuit.cir
* Run log: /home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/examples/pcb/cases/tb001-ga144-test-bringup/outputs/run.log
* Deck contains default models: no

## Run Status
```text
597	1.165570e-02	0.000000e+00	
598	1.167570e-02	0.000000e+00	
599	1.169570e-02	0.000000e+00	
600	1.171570e-02	0.000000e+00	
601	1.173570e-02	0.000000e+00	
602	1.175570e-02	0.000000e+00	
603	1.177570e-02	0.000000e+00	
604	1.179570e-02	0.000000e+00	
605	1.181570e-02	0.000000e+00	
606	1.183570e-02	0.000000e+00	
607	1.185570e-02	0.000000e+00	
608	1.187570e-02	0.000000e+00	
609	1.189570e-02	0.000000e+00	
610	1.191570e-02	0.000000e+00	
611	1.193570e-02	0.000000e+00	
612	1.195570e-02	0.000000e+00	
613	1.197570e-02	0.000000e+00	
614	1.199570e-02	0.000000e+00	
615	1.200000e-02	0.000000e+00	
ngspice-44.2 done
```

## Next Checks
* Replace generic models with vendor or justified project models where they affect decisions.
* Tighten loads, initial conditions, and rail assumptions using corpus evidence.
* Feed any observed failures or sensitivities back into the engineering artifacts.
