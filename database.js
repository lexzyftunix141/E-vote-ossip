// ============================================
// DATABASE SYSTEM - SUPABASE VERSION
// ============================================

const supabaseUrl = 'https://mzqlqbqcnakkxbbqxydp.supabase.co'; // GANTI DENGAN PROJECT URL KAMU
const supabaseKey = 'sb_publishable_DgpBpZBz4a30yqhMY6m5pQ_UWm1KZjo';     // GANTI DENGAN ANON KEY KAMU
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

class VotingDB {
    constructor() {
        this.supabase = supabaseClient;
        console.log('✅ Supabase Database initialized');
    }

    // ============================================
    // VOTER FUNCTIONS
    // ============================================
    async getVoterByUsername(username) {
        const { data, error } = await this.supabase
            .from('voters')
            .select('*')
            .eq('username', username)
            .single();
        
        if (error && error.code !== 'PGRST116') console.error('Error getVoter:', error);
        return data || null;
    }

    async getVoterById(id) {
        const { data } = await this.supabase.from('voters').select('*').eq('id', id).single();
        return data || null;
    }

    async getAllVoters() {
        const { data, error } = await this.supabase.from('voters').select('*').order('id');
        if (error) { console.error(error); return []; }
        return data || [];
    }

    async updateVoter(voterId, updates) {
        const { error } = await this.supabase.from('voters').update(updates).eq('id', voterId);
        return { success: !error, error };
    }


        async deleteVoter(voterId) {
        try {
            // Hapus data voter dari tabel voters
            const { error } = await this.supabase
                .from('voters')
                .delete()
                .eq('id', voterId);

            if (error) throw error;

            return { success: true };
        } catch (error) {
            console.error('❌ Error deleteVoter:', error);
            return { success: false, message: error.message };
        }
    }

    // ============================================
    // CANDIDATE FUNCTIONS
    // ============================================
    async getAllCandidates() {
        const { data, error } = await this.supabase.from('candidates').select('*').order('number');
        if (error) return [];
        return data || [];
    }

    async getCandidate(id) {
        const { data } = await this.supabase.from('candidates').select('*').eq('id', id).single();
        return data || null;
    }

    // ============================================
    // VOTING FUNCTIONS
    // ============================================
            async castVote(voterId, candidateId) {
        try {
            // 1. Cek Kandidat
            const candidate = await this.getCandidate(candidateId);
            if (!candidate) return { success: false, message: 'Kandidat tidak ditemukan' };

            // 2. Cek Voter
            const voter = await this.getVoterById(voterId);
            if (!voter) return { success: false, message: 'Voter tidak ditemukan' };

            // 3. Tambah suara kandidat
            const { error: errCand } = await this.supabase.from('candidates').update({
                votes: (candidate.votes || 0) + 1
            }).eq('id', candidateId);
            
            if (errCand) throw errCand;

            // 4. UPDATE TABEL VOTERS (Ini yang sebelumnya hilang)
            const { error: errVoter } = await this.supabase.from('voters').update({
                has_voted: true,
                vote_candidate_id: candidateId, 
                vote_time: new Date().toISOString()
            }).eq('id', voterId);

            if (errVoter) throw errVoter;

            // 5. Catat ke tabel votes
            const { error: errVote } = await this.supabase.from('votes').insert([{
                voter_id: voterId,
                candidate_id: candidateId,
                voter_name: voter.name,
                candidate_name: candidate.chairman_name,
                candidate_number: candidate.number,
                voter_class: voter.class
            }]);

            if (errVote) throw errVote;

            return { success: true, timestamp: new Date().toISOString() };
        } catch (error) {
            console.error('Error castVote:', error);
            return { success: false, message: error.message };
        }
    }

        async resetSingleVote(voterId) {
        try {
            // 1. Ambil data voter
            const voter = await this.getVoterById(voterId);
            if (!voter) return { success: false, message: 'Voter tidak ditemukan' };

            if (!voter.has_voted) {
                return { success: true, message: 'Voter belum memilih' };
            }

            // 2. Cari semua suara yang pernah diberikan voter ini (di tabel votes)
            const { data: votesData, error: errFetch } = await this.supabase
                .from('votes')
                .select('*')
                .eq('voter_id', voterId);
            
            if (errFetch) throw errFetch;

            // 3. Kurangi jumlah suara kandidat yang dipilih (-1)
            if (votesData && votesData.length > 0) {
                for (const vote of votesData) {
                    const candidate = await this.getCandidate(vote.candidate_id);
                    if (candidate && candidate.votes > 0) {
                        await this.supabase.from('candidates').update({
                            votes: candidate.votes - 1
                        }).eq('id', vote.candidate_id);
                    }
                }
            }

            // 4. Hapus data suara dari tabel votes
            const { error: errDeleteVotes } = await this.supabase
                .from('votes')
                .delete()
                .eq('voter_id', voterId);
            
            if (errDeleteVotes) throw errDeleteVotes;

            // 5. Kembalikan status voter menjadi Belum Memilih
            const { error: errUpdateVoter } = await this.supabase
                .from('voters')
                .update({
                    has_voted: false,
                    vote_candidate_id: null,
                    vote_time: null
                })
                .eq('id', voterId);

            if (errUpdateVoter) throw errUpdateVoter;

            return { success: true };
        } catch (error) {
            console.error('❌ Error resetSingleVote:', error);
            return { success: false, message: error.message };
        }
    }

    
    // ============================================
    // LOGIN VALIDATION
    // ============================================
        async validateLogin(username, token) {
        try {
            const voter = await this.getVoterByUsername(username);
            if (!voter) return { success: false, message: 'Username tidak ditemukan.' };
            
            // Cek apakah token cocok dengan yang ada di database
            if (voter.token !== token) {
                return { success: false, message: 'Token rahasia salah. Silakan hubungi panitia.' };
            }

            if (voter.has_voted) return { success: false, already_voted: true, message: 'Anda sudah memilih.', voter: voter };
            
            return { success: true, voter: voter };
        } catch (error) {
            return { success: false, message: 'Terjadi kesalahan validasi' };
        }
    }
    
    async validateAdminLogin(username, password) {
        const { data } = await this.supabase
            .from('admins')
            .select('*')
            .eq('username', username)
            .eq('password', password)
            .single();

        if (!data) return { success: false, message: 'Username atau password salah' };
        
        return { 
            success: true, 
            admin: { id: data.id, username: data.username, name: data.name, role: data.role }
        };
    }

    // ============================================
    // STATISTICS & RESET
    // ============================================
    async getElectionStats() {
        const voters = await this.getAllVoters();
        const candidates = await this.getAllCandidates();
        const { data: votes } = await this.supabase.from('votes').select('*');

        const totalVoters = voters.length;
        const votedVoters = voters.filter(v => v.has_voted).length;
        const notVotedVoters = totalVoters - votedVoters;
        const votePercentage = totalVoters > 0 ? (votedVoters / totalVoters * 100).toFixed(1) : 0;

        return {
            totalVoters,
            votedVoters,
            notVotedVoters,
            votePercentage,
            totalCandidates: candidates.length,
            totalVotes: votes ? votes.length : 0,
            candidates: candidates.map(c => ({
                id: c.id,
                name: c.chairman_name,
                number: c.number,
                votes: c.votes || 0,
                percentage: votedVoters > 0 ? ((c.votes || 0) / votedVoters * 100).toFixed(1) : 0
            })).sort((a, b) => b.votes - a.votes)
        };
    }
    
        async resetAllVotes() {
        try {
            const { error } = await this.supabase.rpc('reset_all_votes');
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('❌ Error resetAllVotes:', error);
            return { success: false, error: error.message };
        }
    }
}

// Initialize globally
window.db = new VotingDB();
console.log('🚀 Database system ready!');
document.dispatchEvent(new CustomEvent('databaseReady'));