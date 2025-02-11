#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
pub mod encashment {
	use xode_xon20:: {
		XodeXON20Ref,
		xode_xon20:: { Error as TokenError }
	};
    use core::fmt:: Debug;
    use ink_prelude:: {
        string:: {
            String,
        },
        collections::BTreeMap,
    };
    use scale::{
        Decode,
        Encode,
    };

	pub type TokenResult<T> = Result<T, TokenError>;

	#[ink(storage)]
	pub struct Encashment {
		mshl_token: XodeXON20Ref,
		encashment: BTreeMap<u64, EncashmentFormat>,
		contract_owner: AccountId,
	}

	#[derive(Encode, Decode, Clone, Debug)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
	pub struct EncashmentFormat {
		receiver: AccountId,
		mshl_amount: Balance,
		fee_amount: Balance,
		php_amount: Balance,
		kyc_data_url: String,
	}

	#[ink(event)]
	pub struct Encash {
		#[ink(topic)]
		transaction_id: u64,
		#[ink(topic)]
		particular: String,
		usdt_amount: Balance,
		mshl_amount: Balance,
	}

	#[derive(Encode, Decode, Debug, PartialEq, Eq, Copy, Clone)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
		NotValid,
		Unauthorized
	}

	// impl RemittanceFormat {
	// 	pub fn get_format(id: u64, remit: &RemittanceFormat) -> RemittanceFormat {
	// 		RemittanceFormat {
	// 			transaction_id: id,
	// 			receiver: remit.receiver.clone(),
	// 			particular: remit.particular.clone(),
	// 			usdt_amount: remit.usdt_amount.clone(),
	// 			mshl_amount: remit.mshl_amount.clone(),
	// 		}
	// 	}
	// }
	
	impl Encashment {
		#[ink(constructor)]
		pub fn new(
			mshl_token: XodeXON20Ref, 
			contract_owner: AccountId, 
		) -> Self {
			Self {
				mshl_token,
				encashment: BTreeMap::new(),
				contract_owner,
			}
		}

		#[ink(message)]
        pub fn encash(
            &mut self,
            receiver: AccountId,
            mshl_amount: Balance,
            fee_amount: Balance,
            php_amount: Balance,
            kyc_data_url: String,
        ) -> TokenResult<()> {
			// let caller = self.env().caller();
            // if caller != self.contract_owner {
            //     return Err(Error::Unauthorized);
            // }
            let encash_info = EncashmentFormat {
                receiver,
                mshl_amount,
                fee_amount,
                php_amount,
                kyc_data_url: kyc_data_url.clone(),
            };
			let last_encash: &u64 = match self.encashment.last_key_value() {
                Some(data) => data.0,
                None => &0,
            };
            let last_id: u64 = last_encash.checked_add(1).unwrap();
            self.encashment.insert(last_id, encash_info);
			self.burn_mshl(receiver, mshl_amount)
            // self.env().emit_event(Remit {
            //     transaction_id,
            //     particular,
            //     usdt_amount,
            //     mshl_amount,
            // });
            // Ok(())
        }

        pub fn burn_mshl(
			&mut self, 
			from: AccountId, 
			amount: Balance
		) -> TokenResult<()> {
            // let caller = self.env().caller();
            // if caller != self.contract_owner {
            //     return Err(Error::Unauthorized);
            // }
            // Mint MSHL and transfer to the receiver's wallet
            // TODO: Implement the actual mint and transfer logic.
			self.mshl_token.burn(from, amount)
            // Ok(())
        }

		#[ink(message)]
		pub fn change_owner(
			&mut self, 
			new_owner: AccountId
		) -> Result<(), Error> {
			let caller = self.env().caller();
            if caller != self.contract_owner {
                return Err(Error::Unauthorized);
            }
			self.contract_owner = new_owner;
			Ok(())
		}

		#[ink(message)]
        pub fn set_code(&mut self, code_hash: Hash) -> Result<(), Error> {
            let caller = self.env().caller();
            if caller != self.contract_owner {
                return Err(Error::Unauthorized);
            }
            self.env().set_code_hash(&code_hash).unwrap_or_else(|err| {
                panic!("Failed to `set_code_hash` to {code_hash:?} due to {err:?}")
            });
            ink::env::debug_println!("Switched code hash to {:?}.", code_hash);
            Ok(())
        }
	}
}