export function getFirstLetterHint(fullName) {
    if (!fullName) return ""
    const sName = fullName.split(" ")
    return sName.length >= 2
      ? `${sName[0][0]}. ${sName[sName.length - 1][0]}.`
      : `${sName[0][0]}.`
  }
  