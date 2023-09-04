pipeline{
    agent{docker{image:'node'}}
    stages{
        stage('Build'){
            steps{
                sh 'npm --version'
                sh 'npm install'
                sh 'npm run build'
            }
        }
    }
}
