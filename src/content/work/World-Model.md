---
title: "World Model: Emergent Communication with World Models"
publishDate: 2021-06-30 00:00:00
img: /assets/world-model/poster.png
img_alt: A poster of our work on World Model
description: |
  We developed a world model that learns to communicate in a multi-agent environment. Our model contains two types of agents: an observer and a listener.
tags:
  - Reinforcement Learning
  - Deep Learning
---

> Table of Contents

- [Overview](#overview)
  - [Model and Setup](#model-and-setup)
  - [Experiments \& Results](#experiments--results)
  - [Conclusion \& Future Work](#conclusion--future-work)
- [Award](#award)

## Overview

> Let agents talk!

The study aims to achieve more human-like and flexible communication by enabling agents to share information from their unique perspectives. The researchers propose and test a model where the agents' architecture adapts at each step of a task.

### Model and Setup

- **Amodal World Architecture**
  The environment is a grid world.

- **Speaker Agent**
   Has a limited, partial view of the grid. Its role is to generate a message (a vector) to send to the Listener. It learns using the REINFORCE algorithm, rewarded based on the Listener's success.

- **Listener Agent**
  Cannot see the grid world directly. It must act based on the message from the Speaker. Its goal is to navigate to a target location. It learns through imitation learning.

### Experiments & Results

The research was conducted in three steps with increasing complexity:

- **Step 1: Simple Navigation**
  - **Task**

    The Listener must navigate to a goal on a simple, open grid.

  - **Result**

    The agents achieved a 99.5% success rate, demonstrating that they successfully developed a basic communication protocol for navigation.

- **Step 2: Environmental Change**
  - **Task**

    Walls were added to the grid, creating a more complex maze.

  - **Result**

    The agents adapted to the new map and achieved a 92.0% success rate without needing to create new messages, showing the communication protocol could generalize.

- **Step 3: Conditional Change**
  - **Task**

    A "poison" tile was added to the grid. The Listener had to reach the goal while avoiding the poison. This required the Speaker to convey more complex information (e.g., "go here, but avoid that").

  - **Result**
  
    The success rate dropped significantly to 18.7%. While low, the results showed the agents were beginning to learn to use messages to avoid the poison, indicating a more complex communication system was emerging.

### Conclusion & Future Work

The study demonstrates that agents can learn to develop a communication system from scratch to solve cooperative tasks. The system showed an ability to generalize to new environments and adapt to more complex rules.

## Award

Our work on World Model was awarded the Best Paper Award at the 2021 World Models Workshop, which was held by University Tokyo.

Official website: [World Models Workshop (JA)](https://weblab.t.u-tokyo.ac.jp/lecture/course-list/world-model/)
