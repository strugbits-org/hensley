import { logError } from "@/utils";
import { NextResponse } from "next/server";

const CORE_API_BASE_URL = process.env.CORE_API_BASE_URL || '';
const CORE_API_KEY = process.env.CORE_API_KEY || '';

const formIdCache = {};

async function getFormId(formTitle) {
    if (formIdCache[formTitle]) return formIdCache[formTitle];
    const res = await fetch(
        `${CORE_API_BASE_URL}/api/forms?where[title][equals]=${encodeURIComponent(formTitle)}&limit=1`,
        { headers: { Authorization: `Bearer ${CORE_API_KEY}` } }
    );
    const json = await res.json();
    const id = json?.docs?.[0]?.id;
    if (id) formIdCache[formTitle] = id;
    return id;
}

export const POST = async (req, { params }) => {
    try {
        const { name } = await params;
        if (name !== 'contact' && name !== 'newsletter') {
            return NextResponse.json({ error: 'Invalid form name' }, { status: 400 });
        }
        const data = await req.json();
        const formTitle = name === 'contact' ? 'Contact' : 'Newsletter';
        const formId = await getFormId(formTitle);
        if (!formId) {
            throw new Error(`Form '${formTitle}' not found in bps-core. Run seed first.`);
        }
        const submissionData = Object.entries(data)
            .filter(([, value]) => value !== undefined && value !== null && value !== '')
            .map(([field, value]) => ({ field, value: String(value) }));
        const response = await fetch(`${CORE_API_BASE_URL}/api/form-submissions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${CORE_API_KEY}` },
            body: JSON.stringify({ form: formId, submissionData }),
        });
        if (!response.ok) {
            const err = await response.text();
            throw new Error(`bps-core form-submissions error ${response.status}: ${err}`);
        }
        const result = await response.json();
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        logError(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};