import React,{useState,useRef} from "react";
import "../style/home.scss";
import {useInterview} from "../hook/useInterview"
import { Navigate, useNavigate} from "react-router";

function Home() {

  const navigate = useNavigate();
  const {loading, generateReport,reports } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const resumeInputRef = useRef();

  const handleGenerateReport = async ()=>{
    try{
      const resumeFile = resumeInputRef.current.files[0]
    const data = await generateReport
    ({jobDescription, selfDescription, resumeFile})
    
    navigate(`/interview/${data._id}`)
    } catch(error){
      console.error("Failed to generate interview report:",error);
      
    }
    
  }

  if(loading){
    return (
      <main className="loading-screen">
        <h1>Loading your interview plan...</h1>
      </main>
    )
  }

  return (
    <main className="home">
      <div className="interview-input-group">
        <section className="intro-panel" aria-label="Job description">
          <textarea
            className="job-description"
            name="jobDescription"
            id="jobDescription"
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            placeholder="Enter job description here"
          />
        </section>

        <section className="right" aria-label="Interview report details">
          <div className="resume-section">
            <div className="section-heading resume-heading">
              <div>
                <h2>Resume</h2>
                <p>Use Resume and self description together for best results</p>
              </div>
            </div>
            <input
              className="file-input"
              type="file"
              ref = {resumeInputRef}
              name="resume"
              id="resume"
              accept=".pdf,.doc,.docx"
            />
            <label className="file-label" htmlFor="resume">
              <span className="upload-mark" aria-hidden="true">
                <span />
              </span>
              <span className="upload-copy">
                <strong>Upload Resume</strong>
                <small>PDF, DOC, DOCX (Max 5MB)</small>
              </span>
            </label>
          </div>

          <div className="input-group description-group">
            <label className="section-heading" htmlFor="selfDescription">
              <span>Self Description</span>
            </label>
            <textarea
              onChange={(e)=>{setSelfDescription(e.target.value)}}
              name="selfDescription"
              id="selfDescription"
              placeholder="Enter your self description here"
            />
          </div>

          <button onClick={handleGenerateReport} className="button primary-button">
            <span>Generate Interview Report</span>
            <span className="button-arrow" aria-hidden="true" />
          </button>
        </section>
        {/*Recent Repors List*/}
        <section className="recent-reports">
          <h2>Recent Interview Reports</h2>
          <ul className="recent-report-list">
            {reports.map((report) => (
              <li key={report._id} className="recent-report-item" onClick={() => navigate(`/interview/${report._id}`)}>
                <a href={`/interview/${report._id}`}>{report.title}</a>
                <p className="report-date">Generated on: {new Date(report.createdAt).toLocaleDateString()}</p>
                <p className={`match-score ${report.matchScore >= 70 ? 'high' : report.matchScore >= 50 ? 'medium' : 'low'}`}>
                  Match Score: {report.matchScore}%
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

export default Home;
