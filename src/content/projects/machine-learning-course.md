---
title: "Machine Learning Course Projects"
subtitle: "Practice repository covering supervised learning, classification, regression, K-Means, PCA, TensorFlow/Keras neural networks, preprocessing, train/test splitting, and evaluation metrics."
image: "/img/ScatterPlot.png"
tags: ["Python", "Machine Learning", "Scikit-learn", "TensorFlow", "Keras", "Pandas", "NumPy", "PCA", "K-Means"]
topics: ["AI / ML"]
featured: false
links:
  - label: "GitHub Repo"
    url: "https://github.com/philipfleischer/Machine-Learning-Course-1"
---

Hands-on machine learning projects built while working through a structured ML curriculum. The focus is on understanding *why* each technique works, not just calling `.fit()`.

## Topics covered

### Supervised learning
- **Linear regression** — closed-form solution vs gradient descent, cost function minimization
- **Logistic regression** — sigmoid function, binary cross-entropy loss, decision boundary
- **Classification** — multi-class with softmax, one-vs-rest

### Tree-based methods
- Decision trees: information gain, Gini impurity, overfitting and pruning
- Random forests: bagging, feature importance, hyperparameter tuning

### Unsupervised learning
- **K-Means clustering** — elbow method for k selection, convergence, cluster quality metrics
- **PCA (Principal Component Analysis)** — eigendecomposition, explained variance ratio, dimensionality reduction for visualization and feature compression

### Neural networks (TensorFlow/Keras)
- Sequential API: Dense layers, activation functions (ReLU, sigmoid, softmax)
- Training: `model.compile`, `model.fit`, callbacks (EarlyStopping, ModelCheckpoint)
- Preventing overfitting: Dropout, L2 regularisation, batch normalisation

### Data pipeline
- **Pandas** for loading, cleaning, and exploring tabular data
- **NumPy** for vectorised operations and matrix math
- Train/validation/test splitting, `StandardScaler`, one-hot encoding with `pd.get_dummies`
- Evaluation: accuracy, precision, recall, F1, ROC-AUC, confusion matrix

## Key insight
Machine learning is applied linear algebra and statistics. Understanding the math (gradient descent as finding the slope of the loss surface, PCA as variance maximisation) makes it possible to debug models that aren't converging — rather than just trying random hyperparameters.
