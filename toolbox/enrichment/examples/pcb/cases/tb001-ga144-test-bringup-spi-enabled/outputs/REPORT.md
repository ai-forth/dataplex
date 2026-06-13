# Simulation Report: tb001-ga144-test-bringup-spi-enabled

## Purpose
TB001 SPI-enabled bring-up comparison: the same 1.8 V master/UUT rail timing is preserved while the GA144 boot-choice proxy is driven low so reset would see a SPI-boot-allowed startup assumption.

## Circuit Summary
* Title: tb001-ga144-test-bringup-spi-enabled
* Components: 38
* Analyses: tran
* Outputs: v(VIN_MAIN), v(VMASTER), v(VU2), v(VU1), v(VU3), v(BOOTMODE), v(ENABLE_HOLD), v(RESET_ASSERT), v(RESET_HOLD), v(GCORE), v(GIO), v(GAN), v(VCORE), v(VIO), v(VAN)

## Assumptions
* The page-1 master side is represented as an always-on 1.8 V branch split into GA144 test-master, SRAM, and SPI flash sub-loads.
* The page-2 UUT side is represented as three switched branches: V1P8-Core/UUT, V1P8-IO/UUT, and V1P8-Analog/UUT.
* FDS6574A is treated as the stronger N-channel pass family that feeds the UUT branches from the common 1.8 V distribution.
* DMN5L06DMK-AB is treated as the smaller N-channel clamp family that holds branch gates low until control release.
* A 3.3 V control domain is available to pull the branch gates high enough to pass a 1.8 V rail through an N-channel device abstraction.
* This case follows the candidate TB001 operating sequence: master-side rail first, UUT held while control settles, UUT rails enabled, then reset released after settlement.
* BOOTMODE is an explicit proxy for the GA144 705.17 boot-choice state at reset; in this comparison case it is held low to represent a SPI-enabled startup assumption.
* ENABLE_HOLD is an explicit proxy for the page-4/page-5 hold state that keeps the UUT branch gates clamped until the board is ready to energize the UUT rails.
* RESET_ASSERT is an explicit proxy for holding the UUT in reset after rail enable; it is released later than ENABLE_HOLD so the UUT rails can settle first.
* RESET_HOLD is only a timing proxy for deferred UUT activity and not a proven reconstruction of the exact GA144 RESET- wiring.
* For this pass, about 10% modeling accuracy is acceptable if the result preserves the real operating window that matters for GA144 test use.
* GA144 operating fitness is judged primarily against its recommended VDD window of 1.62 V to 2.0 V rather than against an exact 1.800 V target.
* The test-master side should remain substantially stable while the UUT branches are enabled.
* This case is for power-up fitness and intended test usage only; it does not simulate full GA144 logic or protocol behavior.

## Generated Artifacts
* Deck: /home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/examples/pcb/cases/tb001-ga144-test-bringup-spi-enabled/artifacts/circuit.cir
* Run log: /home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/examples/pcb/cases/tb001-ga144-test-bringup-spi-enabled/outputs/run.log
* Deck contains default models: no

## Run Status
```text
605	1.164477e-02	1.770628e+00	1.784855e+00	1.787286e+00	
606	1.166477e-02	1.770628e+00	1.784855e+00	1.787286e+00	
607	1.168477e-02	1.770628e+00	1.784855e+00	1.787286e+00	
608	1.170477e-02	1.770628e+00	1.784855e+00	1.787286e+00	
609	1.172477e-02	1.770628e+00	1.784855e+00	1.787286e+00	
610	1.174477e-02	1.770628e+00	1.784855e+00	1.787286e+00	
611	1.176477e-02	1.770628e+00	1.784855e+00	1.787286e+00	
612	1.178477e-02	1.770628e+00	1.784855e+00	1.787286e+00	
613	1.180477e-02	1.770628e+00	1.784855e+00	1.787286e+00	
614	1.182477e-02	1.770628e+00	1.784855e+00	1.787286e+00	
615	1.184477e-02	1.770628e+00	1.784855e+00	1.787286e+00	
616	1.186477e-02	1.770628e+00	1.784855e+00	1.787286e+00	
617	1.188477e-02	1.770628e+00	1.784855e+00	1.787286e+00	
618	1.190477e-02	1.770628e+00	1.784855e+00	1.787286e+00	
619	1.192477e-02	1.770628e+00	1.784855e+00	1.787286e+00	
620	1.194477e-02	1.770628e+00	1.784855e+00	1.787286e+00	
621	1.196477e-02	1.770628e+00	1.784855e+00	1.787286e+00	
622	1.198477e-02	1.770628e+00	1.784855e+00	1.787286e+00	
623	1.200000e-02	1.770628e+00	1.784855e+00	1.787286e+00	
ngspice-44.2 done
```

## Next Checks
* Replace generic models with vendor or justified project models where they affect decisions.
* Tighten loads, initial conditions, and rail assumptions using corpus evidence.
* Feed any observed failures or sensitivities back into the engineering artifacts.
