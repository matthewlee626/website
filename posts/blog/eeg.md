---
title: 'EEGs: An Exciting Field'
date: '2020-07-01'
---

Over the past two weeks, I've been researching about electroencephalograms (EEGs) and the possibility of employing them in authentication models. As such, I'd like to give a brief introduction about what EEGs are, their usages, and their ethics.

EEGs are a test used to detect electrical activity in the brain. Neurons use electrical impulses to communicate with one another; an EEG uses metal discs on the scalp to record these impulses. These impulses are recorded as waves and can be used to diagnose neurological disorders like epilepsy. As the electrodes are non-invasive, the EEG is a relatively safe procedure.

Research into the diagnostic applications of EEGs generally fall into two categories: spectral analysis and event-related potentials (ERPs). Spectral analysis describes the frequency components of neural oscillations (brain waves) and is used to research their functional roles, which are still not fully understood. ERPs are brain responses to a specific sensory, cognitive, or motor event. One example is the P300 wave, associated with decision making.

In recent years, ERPs have been used to research the viability of EEG-based authentication. Compared to other biometric methods like fingerprints and retinas, ERPs are much more difficult to impersonate. However, these signals are prone to noise, so research has focused on deep learning models that can learn to ignore this noise. While there has been promising results, more work has to be conducted on a larger scale outside of a controlled laboratory, which may not be feasible in the near future due to COVID-19.

Ethics in the area of EEG are a crucial consideration in all future research in this field. Recently, a factory in China began using EEG to monitor worker alertness and attentiveness, calling into question issues of privacy. The brain makes up the identity of a person; as such, all authentication and classification models should consider the ramifications of peering into a person's thoughts.

#### Works Cited

[https://www.healthline.com/health/eeg#results](https://www.healthline.com/health/eeg)
[https://en.wikipedia.org/wiki/Electroencephalography](https://en.wikipedia.org/wiki/Electroencephalography)
[https://sapienlabs.org/ethics-in-eeg/](https://sapienlabs.org/ethics-in-eeg/)
