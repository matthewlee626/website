---
title: 'EEG Authentication'
date: '2020-06-26'
---

# Person Authentication Using Brainwaves (EEG) and Maximum A Posteriori Model Adaptation

Sebastien Marcel and Jose del R. Millan

25 Jun 2020

## Outline

- Brain wave patterns of individuals are unique and using the EEG, can be used for biometric identification.
- Previous work has mostly focused on person identification (matching biometric data against records in a database) as opposed to person authentication (verifying a person's identity by comparing against a template).
- Applying a framework used for speaker and face authenticiation shows great potential.
- Some mental tasks are more appropiate for authentication.

## Terminology

| Term                        | Definition                    |
|-----------------------------|-------------------------------|
| Electroencephalogram (EEG)  | [A test that measures electrical brain signals.](https://www.hopkinsmedicine.org/health/treatment-tests-and-therapies/electroencephalogram-eeg#:~:text=An%20EEG%20is%20a%20test%20that%20detects%20abnormalities,or%20in%20the%20electrical%20activity%20of%20your%20brain.) |
| Gaussian Mixture Model      | [A clustering method that assigns a probability of how much a data point is associated with a cluster.](https://towardsdatascience.com/gaussian-mixture-models-explained-6986aaf5a95) |
| Maximum A Posterior         | [A method of estimating parameters of statistical methods by considering prior knowledge.](https://towardsdatascience.com/a-gentle-introduction-to-maximum-likelihood-estimation-and-maximum-a-posteriori-estimation-d7c318f9d22d) |
| Surface Laplacian           | [A transform that increases topographical specificity and filters out spatially broad features.](https://www.sciencedirect.com/science/article/abs/pii/S0167876015001749#:~:text=The%20surface%20Laplacian%20technique%20in%20EEG%3A%20Theory%20and,3%20Computational%20methods.%20...%204%20Concluding%20remarks.%20)|  
| Incremental Learning          | [A method of ML in which input data is continuously used to extend the existing model's knowledge.](https://en.wikipedia.org/wiki/Incremental_learning)|  

## Concepts

### Introduction

- In authentication, users cooperate and want to be indentified. In identification, this may not be the case.
- The benefits of brain modality comes from confidentiality, difficulty to mimic, and difficulty to steal.
- Brain Computer Interfaces (BCIs) are a noninvasive method of identifying brain activity. EEGs can be used to record such activity, but have small signal amplitudes and are prone to noise.
- EEGs are unique to individuals and could be used in biometric identification if data was cleaned.
- Previous works have analyzed methods such as classification with autoregressive model.

### Approach

- Proposed framework compares a world model trained on several people and a client-dependent model. Authentication access is accepted or rejected if the likelihood of correspondence to the client model with respect to the likelihood of correspondence to the word model is higher or lower than a threshold.
- Probabilities of claims are represented by diagonal Gaussian Mixture Models.
- Maximum A Posterior training improves performance when there is few training data availible.
- A global parameter alpha is chosen to tune the relative importance of the prior.

### Experiment

- Data was collected from nine subjects over three days, with four sessions a day.
- Subjects imagined three repetitive tasks with random order.
- The first step of preprocessing was taking a surface Laplacian, interpolating using spherical splines of order 2 and then taking the second spatial derivative, to find localized activity.
- Every 16 time per second, a 96-dimensional vector containing an EEG sample was created.
- Performance evaluation was based on the Half Total Error Rate (HTER), equal to (False Acceptance Rate + False Rejection Rate) / 2.
![FAR/FRR](./imgs/FARFRR.png)
- Protocol 1 evaluates the potential of the method on a small dataset based on cross-validation. Sessions from one day are used to train the model as a client and imposter.
  - For each Kfold:
    - Validation set: Eight accesses with two client and six imposter (two unseen)
    - Evaluation set: Twelve accesses with four client and eight imposter
- Protocol 2
  - Findings of Protocol 1 are extended to a larger data set and performance degredation over days is measured.
- Protocol 3
  - The protocol is used to demonstrate that training over several days increases the performance.
- Protocol 4
  - The protocol is used to demonstrate the benefit of incremental learning.

### Results

- Protocol 1
  - EEG signals are effective for person authentication and the GMM/MAP framework is a good choice.
  - **Some tasks are better than others. The bestresult was obtained with the "left" mental task.**
  - The optimal number of Gaussians is small (8, 16); a small number fails to capture the complexity and a large number models noise.
- Protocol 2
  - Mismatch between testing and training increases from day to day. Robust models must include multiple days.
  - **Performance degrades over days. The FAR becomes much lower than the FRR.**
- Protocol 3
  - **Performance is increased by training over multiple days.**
- Protocol 4
  - Training is incremental because client models are retrained completely from all training data are are not readpated using new data samples.
  - **There is potential for incremental learning. Improvement of HTER is due to reduction of FRR. Intra-class variability is better modeled.**

### Final Conclusions

- The main conclusions are the four bolded sentences above.
- The database is small and there are no conclusive lessons. Other algorithms can be explored.

## Critiques

- The approach, specifically the GMM/MAP model, was quite dense. I needed further research on the specifics.
- The result graphs are mildly difficult to interpret.
- There was a rough background on EEGs.