# HetGNN-KGAT For EduPath
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/Django-3.2.25-green)](https://www.djangoproject.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.4.9-orange)](https://www.chartjs.com/)
[![CoreUI](https://img.shields.io/badge/CoreUI-4.3.0-purple)](https://coreui.io/)

This repository contains resources related to the paper titled **"HetGNN-KGAT: Enhancing Personalized Course Recommendation in MOOCs with Knowledge Graph Attention Networks"** and the associated EduPath system, a simulated MOOCs platform integrating personalized course recommendations for educational administrators.

The website demonstration is available at the [link](https://drive.google.com/file/d/1HrBSYTLEmjdhFYRO_VKq9ohmjh6fDHR9/view?usp=sharing)

## Overview

The paper proposes the **HetGNN-KGAT framework**, a novel approach to enhance personalized course recommendations in Massive Open Online Courses (MOOCs) by leveraging Heterogeneous Graph Neural Networks (HetGNN) and Knowledge Graph Attention Networks (KGAT). The framework addresses data sparsity and improves recommendation performance by integrating heterogeneous data and modeling complex relationships among learners, courses, and other entities in the MOOC ecosystem.

**EduPath** is a web-based system designed to simulate a MOOCs platform, enabling educational administrators to:

- Monitor learner and course information
- Generate personalized course recommendations using the HetGNN-KGAT model
- Evaluate data quality and model performance through an intuitive dashboard

The repository includes the LaTeX source of the paper, source code, datasets, and a demo of the EduPath system.

## Repository Structure

```
|-- src/
|   |-- data/                # Datasets used in the paper (e.g., MOOCCubeX)
|   |-- notebooks/           # Jupyter notebooks for preprocessing, imputation, training, and evaluation
|   |-- Demo/
|       |-- backend/         # Backend code for EduPath (Django + Django REST Framework)
|       |-- frontend/        # Frontend code for EduPath (React + CoreUI)
|-- submission/
|   |-- note.md              # Notes on submission and review process (currently empty)
|-- README.md                # This file
```

## Contents

### 1. src

- **data/**: Contains the MOOCCubeX dataset used for experiments, with details on entities (learners, courses, concepts, etc.) and attributes (e.g., course_field, user_course_num_comments)

- **notebooks/**: Jupyter notebooks covering:
  - Data preprocessing and cleaning
  - HetGNN-based data imputation
  - Model training and evaluation (metrics: Precision@K, Recall@K, NDCG@K, MAP@K, F1@K)

- **Demo/**: Source code for the EduPath web demo
  - **backend/**: Built with Django and Django REST Framework, providing RESTful APIs for learner/course data, recommendations, and dashboard metrics
  - **frontend/**: Built with React and CoreUI, offering an intuitive interface for educational administrators to view learner/course details, recommendations, and analytics

### 2. submission

- **note.md**: Placeholder for submission and review-related notes (currently empty)

## Workflow Diagram

The following diagram illustrates the workflow of the HetGNN-KGAT framework and EduPath system as described in the paper:
![HetGNN-KGAT Framework](/src/framework_journal.png)

The workflow includes:

1. **Data Collection**: Gathering data from the MOOCCubeX dataset, including learner profiles, course details, and interaction data
2. **Data Preprocessing and Imputation**: Performing preprocessing steps with a focus on HetGNN-based imputation to handle missing values and ensure data quality for modeling
3. **Model Training**: Implementing the HetGNN-KGAT model to generate personalized course recommendations, trained on the preprocessed data
4. **Evaluation and Visualization**: Assessing data quality and model performance using metrics like direct evaluation (Completeness, Consistency), indirect evaluation include Relevance (Precision@K, Recall@K, NDCG@K), Reliability (MAP@K), and model performance using F1-score @K, with results visualized in the EduPath dashboard for educational administrators

## EduPath System

EduPath is a simulated MOOCs platform designed to demonstrate the HetGNN-KGAT recommendation framework. It serves as both an evaluation environment and a tool for educational administrators to:

- View lists and details of learners and courses
- Generate personalized course recommendations (top-10 courses per learner)
- Monitor data quality (completeness, consistency) and model performance via a dashboard
- Access visualizations, such as gender distribution, top-10 course fields, and model evaluation metrics

### System Architecture

- **Frontend**: React with CoreUI for a user-friendly interface
- **Backend**: Django with Django REST Framework for API-based data processing and model integration
- **Database**: MongoDB for flexible storage of learner profiles, course data, recommendations, and dashboard metrics

### Demo Features

- **Course Management**: View all courses and their details (e.g., course ID, name, field, instructor, enrollment count)
- **Learner Management**: View learner lists and details (e.g., ID, name, gender, enrolled courses, recent course history)
- **Personalized Recommendations**: Generate top-10 course recommendations for each learner with explanations
- **Dataset Overview**: Display details of MOOCCubeX data files and their roles
- **Dashboard**: Visualize statistics (e.g., learner gender ratio, popular course fields) and model performance metrics

## Getting Started

### Prerequisites

- Python 3.11.5+ (for notebooks and backend)
- Node.js 16.+ (for frontend)
- npm
- MongoDB (for database)
- LaTeX distribution (e.g., TeX Live) for compiling the paper

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/HetGNN-KGAT-forEduPath.git
   cd HetGNN-KGAT-forEduPath
   ```

2. **Set Up the Backend**:
   ```bash
   cd src/Demo/backend
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

3. **Set Up the Frontend**:
   ```bash
   cd src/Demo/frontend
   npm install
   npm rundev
   ```

4. **Compile the LaTeX Paper**:
   ```bash
   cd LaTex-paper
   pdflatex main.tex
   bibtex main
   pdflatex main.tex
   pdflatex main.tex
   ```

5. **Run Notebooks**:
   - Open `src/notebooks/` in Jupyter Notebook or JupyterLab
   - Follow the instructions in each notebook for preprocessing, imputation, training, and evaluation

### Dataset

- The dataset is stored in `src/data/`: The dataset is derived from MOOCCubeX, which has been filtered and processed before being used in the model.
- Ensure MongoDB is running to load the dataset for the EduPath demo

## Usage

### Run EduPath Demo

1. Start the backend server (`python manage.py runserver`)
2. Start the frontend (`npm run dev`)
3. Access the web interface at `http://localhost:5173` to explore course/learner management, recommendations, and the dashboard

### Experiment with Notebooks

1. Download the raw data from the [MOOCCubeX dataset](https://github.com/THU-KEG/MOOCCubeX).

2. Preprocess and clean the data:
- Located in: notebooks/PreprocessingandCleaning/
- Tasks include: data cleaning, translation to English, and merging of related datasets.

3. Impute missing values:
- Implemented in: notebooks/Imputation/
- Various imputation methods are applied to generate multiple completed versions of the dataset.

4. Model experimentation:
- Performed in: notebooks/Model/
- Each imputed dataset version is evaluated on different recommendation models.

<!-- ## Citation

If you use this work, please cite our paper:

```bibtex
@article{nguyen2023hetgnn,
  author={Nguyen, Thu and Do, Dat and Vu, Huong and Vo, Khoa Tan and Ta, Thu-Thuy and Nguyen Thi, Mong-Thy and Nguyen, Phuc and Nguyen, Hong-Thi and Nguyen Hoang, Ti-Anh},
  title={HetGNN-KGAT: Enhancing Personalized Course Recommendation in MOOCs with Knowledge Graph Attention Networks},
  journal={IEEE Access},
}
``` -->

## Contributors

- **Leader**: M.Sc. IT. Thu Nguyen
- **Members**: Dat Do, Huong Vi

<!-- ## Contact

For inquiries, please contact:

- Thu Nguyen: thungh@uit.edu.vn
- Hong-Thi Nguyen: hong-thi.nguyen@uit.edu.vn -->
