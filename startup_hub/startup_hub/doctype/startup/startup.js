// Copyright (c) 2025, Mostafa and contributors
// For license information, please see license.txt

frappe.ui.form.on("Startup", {
    
    refresh: function(frm) {
        // 1. Welcome Message
        if (frm.is_new()) {
            frm.set_intro('Welcome! Fill in the startup details below.', 'blue');
        } else {
            frm.set_intro('Startup: ' + frm.doc.startup_name + ' | Stage: ' + frm.doc.stage, 'green');
        }

        // 2. Custom Button - View Funding Rounds
        if (!frm.is_new()) {
            frm.add_custom_button(__('View Funding Rounds'), function() {
                frappe.set_route('List', 'Funding Round', {
                    'startup': frm.doc.name
                });
            }, __('Actions'));

            // 3. Custom Button - View Meetings
            frm.add_custom_button(__('View Meetings'), function() {
                frappe.set_route('List', 'Meeting', {
                    'startup': frm.doc.name
                });
            }, __('Actions'));

            // 4. Custom Button - View Milestones
            frm.add_custom_button(__('View Milestones'), function() {
                frappe.set_route('List', 'Milestone', {
                    'startup': frm.doc.name
                });
            }, __('Actions'));

            // 5. Custom Button - Add New Funding Round
            frm.add_custom_button(__('New Funding Round'), function() {
                frappe.new_doc('Funding Round', {
                    'startup': frm.doc.name
                });
            }, __('Create'));

            // 6. Custom Button - Add New Meeting
            frm.add_custom_button(__('New Meeting'), function() {
                frappe.new_doc('Meeting', {
                    'startup': frm.doc.name
                });
            }, __('Create'));
        }

        // 7. Change form color based on Status
        if (frm.doc.status === 'Active') {
            frm.set_indicator_formatter('status',
                function(doc) { return 'green'; }
            );
        } else if (frm.doc.status === 'Graduated') {
            frm.set_indicator_formatter('status',
                function(doc) { return 'blue'; }
            );
        } else if (frm.doc.status === 'Dropped') {
            frm.set_indicator_formatter('status',
                function(doc) { return 'red'; }
            );
        }
    },

    // 8. Stage Change Event
    stage: function(frm) {
        if (frm.doc.stage === 'Idea') {
            frappe.msgprint({
                title: __('Idea Stage'),
                indicator: 'blue',
                message: __('Focus on validating your idea with potential customers!')
            });
        } else if (frm.doc.stage === 'MVP') {
            frappe.msgprint({
                title: __('MVP Stage'),
                indicator: 'orange',
                message: __('Build your Minimum Viable Product and get early users!')
            });
        } else if (frm.doc.stage === 'Seed') {
            frappe.msgprint({
                title: __('Seed Stage'),
                indicator: 'green',
                message: __('Time to raise your first funding round!')
            });
        } else if (frm.doc.stage === 'Growth') {
            frappe.msgprint({
                title: __('Growth Stage'),
                indicator: 'green',
                message: __('Scale your business and expand to new markets! 🚀')
            });
            // Make website mandatory for Growth stage
            frm.set_df_property('website', 'reqd', 1);
        }
    },

    // 9. Status Change Event
    status: function(frm) {
        if (frm.doc.status === 'Graduated') {
            frappe.confirm(
                'Congratulations! Is this startup ready to graduate?',
                function() {
                    // Yes
                    frappe.msgprint('🎉 Startup marked as Graduated!');
                },
                function() {
                    // No
                    frm.set_value('status', 'Active');
                }
            );
        } else if (frm.doc.status === 'Dropped') {
            frappe.confirm(
                'Are you sure you want to mark this startup as Dropped?',
                function() {
                    // Yes
                    frappe.msgprint('😔 Startup marked as Dropped');
                },
                function() {
                    // No
                    frm.set_value('status', 'Active');
                }
            );
        }
    }

});