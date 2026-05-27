// Directed Comments Data Structure and Functions
let selectedDirectedComments = [];
let directedCommentsData = {};

const directedComments = {
    awards: {
        title: "Awards (Personal Awards)",
        preview: "MRO was the subject of a [Award Name] on [Date]",
        template: "Directed Comment: Section A, Item 6a – MRO was the subject of a {award_name} on {date}.",
        fields: [
            { key: "award_name", label: "Award Name", placeholder: "Navy and Marine Corps Achievement Medal", type: "text" },
            { key: "date", label: "Award Date", placeholder: "YYYYMMDD", type: "date" }
        ]
    },
    relief_for_cause: {
        title: "Relief for Cause (Adverse)",
        preview: "MRO was relieved for cause on [Date]",
        template: "Directed Comment: Section A, Item 8g – MRO was relieved for cause on {date}. See Section F and Section I for further details.",
        fields: [
            { key: "date", label: "Relief Date", placeholder: "YYYYMMDD", type: "date" }
        ]
    },
    not_recommended: {
        title: "Not Recommended for Promotion (Adverse)",
        preview: "MRO is not recommended for promotion",
        template: "Directed Comment: Section A, Item 8h – MRO is not recommended for promotion.",
        fields: []
    },
    failed_pft_cft: {
        title: "Failed PFT/CFT",
        preview: "MRO failed to meet minimum standard for [Test] on [Date]",
        template: "Directed Comment: Section A, Item 6d – MRO failed to meet the minimum standard for the {test_type} on {date}.",
        fields: [
            { key: "test_type", label: "Test Type", placeholder: "PFT or CFT", type: "select", options: ["PFT", "CFT"] },
            { key: "date", label: "Test Date", placeholder: "YYYYMMDD", type: "date" }
        ]
    },
    bcp: {
        title: "Body Composition Program (BCP)",
        preview: "MRO was assigned to the BCP on [Date]",
        template: "Directed Comment: Section A, Item 6e – MRO was assigned to the BCP on {date}.",
        fields: [
            { key: "date", label: "BCP Assignment Date", placeholder: "YYYYMMDD", type: "date" }
        ]
    },
    body_composition: {
        title: "Body Composition",
        preview: "Select body composition status",
        type: "dynamic",
        options: {
            whtr_in_standards: {
                label: "Within WHtR Standards",
                template: "Directed Comment. Sect A, Item 8e: The MRO’s current body composition evaluation is within standards.",
                fields: []
            },
            exceeds_whtr_in_body_fat_standards: {
                label: "Exceeds WHtR, Within Body Fat Standards",
                template: "Directed Comment. Sect A, Item 8f: The MRO’s current body composition evaluation is within standards.",
                fields: []
            },
            exceeds_whtr_and_body_fat: {
                label: "Exceeds WHtR and Body Fat",
                template: "Directed Comment. Sect A, Item 8e and 8f: The MRO completed a body composition evaluation with a height measurement of {height} inches and waist measurement of {waist} inches. The MRO’s body fat percentage was {tape_test_pbf} percent using the multi-site tape test and {bia_pbf} percent using BIA. MRO is not within body composition standards.",
                fields: [
                    { key: "height", label: "Height (in)", placeholder: "XX.X", type: "number" },
                    { key: "waist", label: "Waist (in)", placeholder: "XX.X", type: "number" },
                    { key: "tape_test_pbf", label: "Tape Test PBF", placeholder: "XX", type: "number" },
                    { key: "bia_pbf", label: "BIA PBF", placeholder: "XX.X", type: "number" }
                ]
            },
            waiver_exemption: {
                label: "Waiver or Exemption",
                template: "Directed Comment Sect A, Item 8d-f: The MRO has been granted a body composition evaluation exemption / waiver in accordance with {reference}.",
                fields: [
                    { key: "reference", label: "Reference", placeholder: "MARADMIN 066/26 or MCO 6110.3A", type: "text" }
                ]
            },
            bcp_waiver: {
                label: "BCP Assignment Waiver",
                template: "Directed Comment. Sect A, Item 8e and 8f: The MRO completed a body composition evaluation with a height measurement of {height} inches and waist measurement of {waist} inches. The MRO’s body fat percentage was {tape_test_pbf} percent using the multi-site tape test and {bia_pbf} percent using BIA. The MRO is outside of standards but has been granted a waiver.",
                fields: [
                    { key: "height", label: "Height (in)", placeholder: "XX.X", type: "number" },
                    { key: "waist", label: "Waist (in)", placeholder: "XX.X", type: "number" },
                    { key: "tape_test_pbf", label: "Tape Test PBF", placeholder: "XX", type: "number" },
                    { key: "bia_pbf", label: "BIA PBF", placeholder: "XX.X", type: "number" }
                ]
            }
        }
    },
    military_education: {
        title: "Military Education (PME Completed)",
        preview: "MRO completed [Course Name] on [Date]",
        template: "Directed Comment: Section A, Item 6a – MRO completed {course_name} on {date}.",
        fields: [
            { key: "course_name", label: "Course Name", placeholder: "Corporals Course (nonresident)", type: "text" },
            { key: "date", label: "Completion Date", placeholder: "YYYYMMDD", type: "date" }
        ]
    },
    disciplinary_action: {
        title: "Disciplinary Action (NJP, Courts-Martial)",
        preview: "MRO received [Action] on [Date] for [Description]",
        template: "Directed Comment: Section A, Item 6f – MRO received {action_type} on {date} for {description}.",
        fields: [
            { key: "action_type", label: "Action Type", placeholder: "NJP", type: "select", options: ["NJP", "Summary Court-Martial", "Special Court-Martial", "General Court-Martial"] },
            { key: "date", label: "Action Date", placeholder: "YYYYMMDD", type: "date" },
            { key: "description", label: "Brief Description", placeholder: "brief description of offense", type: "text" }
        ]
    },
    security_clearance: {
        title: "Security Clearance Revoked/Denied",
        preview: "MRO's security clearance was [Action] on [Date]",
        template: "Directed Comment: Section A, Item 6g – MRO's security clearance was {action} on {date}.",
        fields: [
            { key: "action", label: "Action", placeholder: "revoked or denied", type: "select", options: ["revoked", "denied", "suspended"] },
            { key: "date", label: "Action Date", placeholder: "YYYYMMDD", type: "date" }
        ]
    },
    adverse_material: {
        title: "Adverse Material Submitted",
        preview: "MRO's report contains adverse material per Chapter 5",
        template: "Directed Comment: Section A, Item 8e – MRO's report contains adverse material per Chapter 5.",
        fields: []
    },
    allegations_unsubstantiated: {
        title: "Accusations Not Substantiated",
        preview: "Allegations against MRO were investigated and found unsubstantiated",
        template: "Directed Comment: Section A, Item 6f – Allegations against MRO were investigated and found unsubstantiated.",
        fields: []
    },
    combat_reporting: {
        title: "Combat Reporting",
        preview: "MRO participated in [Operations] during this period",
        template: "Directed Comment: Section A, Item 6b – MRO participated in {operations} during this period.",
        fields: [
            { key: "operations", label: "Combat Operations", placeholder: "named combat operations", type: "text" }
        ]
    },
    simultaneous_reports: {
        title: "Simultaneous Reports",
        preview: "This report was submitted concurrently with another",
        template: "Simultaneous Report. This report was submitted concurrently with another due to MRO's multiple billet assignments.",
        fields: []
    },
    enlisted_to_officer: {
        title: "Enlisted-to-Officer Programs",
        preview: "MRO is highly recommended for [Program]",
        template: "Directed Comment: Section A, Item 8i – MRO is highly recommended for {program}.",
        fields: [
            { key: "program", label: "Program", placeholder: "MECEP/MCP-R/other program", type: "select", options: ["MECEP", "MCP-R", "ECP", "WO", "Other"] }
        ]
    },
    reenlistment: {
        title: "Reenlistment Recommendation",
        preview: "MRO is recommended for reenlistment",
        template: "Directed Comment: Section A, Item 8j – MRO is recommended for reenlistment.",
        fields: []
    }
};

// showDirectedCommentsScreen()
function showDirectedCommentsScreen() {
    document.querySelectorAll('.evaluation-card, .review-card, .section-i-generation-card, .summary-card').forEach(card => {
        card.classList.remove('active');
        card.style.display = 'none';
    });

    const dcCard = document.getElementById('directedCommentsCard');
    dcCard.classList.add('active');
    dcCard.style.display = 'block';

    try { document.getElementById('progressText').textContent = 'Directed Comments Selection'; } catch (_) {}

    renderDirectedCommentsGrid();
}

function renderDirectedCommentsGrid() {
    const grid = document.getElementById('directedCommentsGrid');
    grid.innerHTML = '';
    
    Object.keys(directedComments).forEach(key => {
        const comment = directedComments[key];
        const isSelected = selectedDirectedComments.includes(key);
        
        const item = document.createElement('div');
        item.className = `directed-comment-item ${isSelected ? 'selected' : ''}`;
        item.onclick = () => toggleDirectedComment(key);
        
        item.innerHTML = `
            <div class="comment-title">${comment.title}</div>
            <div class="comment-preview">${comment.preview}</div>
        `;
        
        grid.appendChild(item);
    });
    
    updateSelectedCommentsSection();
}

function toggleDirectedComment(commentKey) {
    const index = selectedDirectedComments.indexOf(commentKey);
    if (index > -1) {
        selectedDirectedComments.splice(index, 1);
        delete directedCommentsData[commentKey];
    } else {
        selectedDirectedComments.push(commentKey);
        directedCommentsData[commentKey] = {};
    }
    
    renderDirectedCommentsGrid();
}

function updateSelectedCommentsSection() {
    const section = document.getElementById('selectedCommentsSection');
    const form = document.getElementById('selectedCommentsForm');
    
    if (selectedDirectedComments.length === 0) {
        section.classList.remove('active');
        return;
    }
    
    section.classList.add('active');
    form.innerHTML = '';
    
    selectedDirectedComments.forEach(commentKey => {
        const comment = directedComments[commentKey];
        const formDiv = document.createElement('div');
        formDiv.className = 'comment-form';
        
        let fieldsHTML = '';
        if (comment.type === 'dynamic') {
            fieldsHTML += `
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #1e3c72;">Select Situation:</label>
                    <select class="placeholder-input" onchange="updateDynamicComment('${commentKey}', this.value)">
                        <option value="">Select Situation</option>
                        ${Object.keys(comment.options).map(key => `<option value="${key}">${comment.options[key].label}</option>`).join('')}
                    </select>
                </div>
                <div id="dynamic-fields-${commentKey}"></div>
            `;
        } else if (comment.fields.length > 0) {
            fieldsHTML = '<div class="form-row">';
            comment.fields.forEach(field => {
                if (field.type === 'select') {
                    fieldsHTML += `
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #1e3c72;">${field.label}:</label>
                            <select class="placeholder-input" onchange="updateDirectedCommentData('${commentKey}', '${field.key}', this.value)">
                                <option value="">Select ${field.label}</option>
                                ${field.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                            </select>
                        </div>
                    `;
                } else if (field.type === 'date') {
                    fieldsHTML += `
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #1e3c72;">${field.label}:</label>
                            <input type="date" class="placeholder-input" onchange="updateDirectedCommentData('${commentKey}', '${field.key}', this.value)" />
                        </div>
                    `;
                } else {
                    fieldsHTML += `
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #1e3c72;">${field.label}:</label>
                            <input type="text" class="placeholder-input" placeholder="${field.placeholder}" oninput="updateDirectedCommentData('${commentKey}', '${field.key}', this.value)" />
                        </div>
                    `;
                }
            });
            fieldsHTML += '</div>';
        }
        
        formDiv.innerHTML = `
            <div class="comment-form-title">${comment.title}</div>
            ${fieldsHTML}
            <div class="comment-preview-text" id="preview-${commentKey}">${comment.preview}</div>
        `;
        
        form.appendChild(formDiv);
    });
}

function updateDirectedCommentData(commentKey, fieldKey, value) {
    if (!directedCommentsData[commentKey]) {
        directedCommentsData[commentKey] = {};
    }
    
    // Handle date formatting
    if (value && value.includes('-')) {
        // Convert YYYY-MM-DD to YYYYMMDD
        value = value.replace(/-/g, '');
    }
    
    directedCommentsData[commentKey][fieldKey] = value;
    updateCommentPreview(commentKey);
}

function updateCommentPreview(commentKey) {
    const comment = directedComments[commentKey];
    const data = directedCommentsData[commentKey] || {};
    const previewElement = document.getElementById(`preview-${commentKey}`);

    if (!previewElement) return;

    let preview;
    if (comment.type === 'dynamic') {
        if (data.selectedOption) {
            const option = comment.options[data.selectedOption];
            preview = option.template;
            option.fields.forEach(field => {
                const value = data[field.key] || `{${field.key}}`;
                preview = preview.replace(`{${field.key}}`, value);
            });
        } else {
            preview = comment.preview;
        }
    } else {
        preview = comment.template;
        comment.fields.forEach(field => {
            const value = data[field.key] || `{${field.key}}`;
            preview = preview.replace(`{${field.key}}`, value);
        });
    }

    previewElement.textContent = preview;
}

function updateDynamicComment(commentKey, optionKey) {
    const comment = directedComments[commentKey];
    const dynamicFieldsContainer = document.getElementById(`dynamic-fields-${commentKey}`);
    dynamicFieldsContainer.innerHTML = '';

    if (!optionKey) {
        directedCommentsData[commentKey] = {};
        updateCommentPreview(commentKey);
        return;
    }

    const option = comment.options[optionKey];
    directedCommentsData[commentKey] = { selectedOption: optionKey };

    if (option.fields.length > 0) {
        let fieldsHTML = '<div class="form-row">';
        option.fields.forEach(field => {
            fieldsHTML += `
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #1e3c72;">${field.label}:</label>
                    <input type="${field.type}" class="placeholder-input" placeholder="${field.placeholder}" oninput="updateDirectedCommentData('${commentKey}', '${field.key}', this.value)" />
                </div>
            `;
        });
        fieldsHTML += '</div>';
        dynamicFieldsContainer.innerHTML = fieldsHTML;
    }

    updateCommentPreview(commentKey);
}

function generateDirectedCommentsText() {
    let commentsText = '';

    selectedDirectedComments.forEach(commentKey => {
        const comment = directedComments[commentKey];
        const data = directedCommentsData[commentKey] || {};

        let commentText;
        if (comment.type === 'dynamic') {
            if (data.selectedOption) {
                const option = comment.options[data.selectedOption];
                commentText = option.template;
                option.fields.forEach(field => {
                    const value = data[field.key] || `[${field.label}]`;
                    commentText = commentText.replace(`{${field.key}}`, value);
                });
            } else {
                commentText = ''; // or some default/error text
            }
        } else {
            commentText = comment.template;
            comment.fields.forEach(field => {
                const value = data[field.key] || `[${field.label}]`;
                commentText = commentText.replace(`{${field.key}}`, value);
            });
        }

        if (commentText) {
            commentsText += commentText + '\n\n';
        }
    });

    return commentsText.trim();
}

// finalizeDirectedComments()
function finalizeDirectedComments() {
    // Validate required fields
    let missingFields = [];
    selectedDirectedComments.forEach(commentKey => {
        const comment = directedComments[commentKey];
        const data = directedCommentsData[commentKey] || {};

        if (comment.type === 'dynamic') {
            if (!data.selectedOption) {
                missingFields.push(`${comment.title}: Please select a situation`);
            } else {
                const option = comment.options[data.selectedOption];
                option.fields.forEach(field => {
                    if (!data[field.key]) {
                        missingFields.push(`${comment.title} (${option.label}): ${field.label}`);
                    }
                });
            }
        } else {
            comment.fields.forEach(field => {
                if (!data[field.key]) {
                    missingFields.push(`${comment.title}: ${field.label}`);
                }
            });
        }
    });

    if (missingFields.length > 0) {
        alert('Please complete the following required fields:\n\n' + missingFields.join('\n'));
        return;
    }
    
    // Store directed comments in evaluation meta
    evaluationMeta.directedComments = generateDirectedCommentsText();

    const dcCard = document.getElementById('directedCommentsCard');
    dcCard.classList.remove('active');
    dcCard.style.display = 'none';

    showSectionIGeneration();
}

// skipDirectedComments()
function skipDirectedComments() {
    if (selectedDirectedComments.length > 0) {
        if (!confirm('You have selected directed comments but haven\'t completed them. Are you sure you want to skip?')) {
            return;
        }
    }
    
    evaluationMeta.directedComments = '';

    const dcCard = document.getElementById('directedCommentsCard');
    dcCard.classList.remove('active');
    dcCard.style.display = 'none';

    showSectionIGeneration();
}